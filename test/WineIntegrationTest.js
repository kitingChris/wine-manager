const supertest = require('supertest');
const restify = require('restify');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const fixtures = require('node-mongoose-fixtures');

const server = restify.createServer();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wine-manager-test');
mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));

server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.queryParser());

server.get('/wines/', require('../src/handler/listWineHandler'));
server.post('/wines/', require('../src/handler/postWineHandler'));
server.get('/wines/:id', require('../src/handler/getWineHandler'));
server.put('/wines/:id', require('../src/handler/putWineHandler'));
server.del('/wines/:id', require('../src/handler/deleteWineHandler'));

const Wine = require('../src/model/Wine');
const Sequence = require('../src/model/Sequence');


describe('GET /wines/', function () {

    before(function (done) {
        setupMongoTestCollections({
            Wine: [
                {
                    id: 0,
                    name: 'Cabernet sauvignon',
                    year: 2013,
                    country: 'France',
                    type: 'red',
                    description: 'The Sean Connery of red wines'
                },
                {
                    id: 1,
                    name: 'Pinot noir',
                    year: 2011,
                    country: 'France',
                    type: 'red',
                    description: 'Sensual and understated'
                },
                {
                    id: 2,
                    name: 'Zinfandel',
                    year: 1990,
                    country: 'Croatia',
                    type: 'red',
                    description: 'Thick and jammy'
                }
            ]
        }, done);
    });

    it('should respond with a list of wines', function (done) {
        supertest(server)
            .get('/wines/')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(200);
                expect(result.body.length).to.be.equal(3);
                done();
            });
    });
});

describe('GET /wines/:id', function () {

    before(function (done) {
        setupMongoTestCollections({
            Wine: [
                {
                    name: 'Cabernet sauvignon',
                    year: 2013,
                    country: 'France',
                    type: 'red',
                    description: 'The Sean Connery of red wines'
                }
            ]
        }, done);
    });

    it('should respond with a wines entry', function (done) {
        supertest(server)
            .get('/wines/0')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(200);
                expect(result.body).to.be.deep.equal({
                    id: 0,
                    name: 'Cabernet sauvignon',
                    year: 2013,
                    country: 'France',
                    type: 'red',
                    description: 'The Sean Connery of red wines'
                });
                done();
            });
    });

    it('should respond with an error if no entry exists', function (done) {
        supertest(server)
            .get('/wines/1')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'UNKNOWN_OBJECT'
                });
                done();
            });
    });
});

describe('POST /wines/', function () {

    before(function (done) {
        setupMongoTestCollections({
            Wine: [
                {
                    name: 'Cabernet sauvignon',
                    year: 2013,
                    country: 'France',
                    type: 'red',
                    description: 'The Sean Connery of red wines'
                }
            ]
        }, done);
    });

    it('should respond with the saved entity if successfully persisted', function (done) {
        supertest(server)
            .post('/wines/')
            .send({
                name: 'Pinot noir',
                year: 2011,
                country: 'France',
                type: 'red',
                description: 'Sensual and understated'
            })
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(200);
                expect(result.body).to.be.deep.equal({
                    id: 1,
                    name: 'Pinot noir',
                    year: 2011,
                    country: 'France',
                    type: 'red',
                    description: 'Sensual and understated'
                });
                supertest(server)
                    .get('/wines/')
                    .set('Accept', 'application/json')
                    .end(function (error, result) {

                        expect(result.status).to.be.equal(200);
                        expect(result.body.length).to.be.equal(2);
                        done();
                    });
            });
    });

    it('should respond with an error if not all mandatory fields are given', function (done) {
        supertest(server)
            .post('/wines/')
            .send({})
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'VALIDATION_ERROR',
                    validation: {
                        country: 'MISSING',
                        name: 'MISSING',
                        type: 'MISSING',
                        year: 'MISSING'
                    }
                });
                done();
            });
    });

    it('should respond with an error if some fields are invalid', function (done) {
        supertest(server)
            .post('/wines/')
            .send({
                name: 'Pinot noir',
                year: -1,
                country: 'France',
                type: 'invalid',
                description: 'Sensual and understated'
            })
            .type('json')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'VALIDATION_ERROR',
                    validation: {
                        type: 'INVALID',
                        year: 'INVALID'
                    }
                });

                done();

            });
    });

});

describe('PUT /wines/:id', function () {

    before(function (done) {
        setupMongoTestCollections({
            Wine: [
                {
                    name: 'Pinot noir',
                    year: 2011,
                    country: 'France',
                    type: 'red',
                    description: 'Sensual and understated'
                }
            ]
        }, done);
    });

    it('should respond with the saved entity if successfully persisted', function (done) {
        supertest(server)
            .put('/wines/0')
            .send({
                description: 'Sensual and understated (Strawberry, raspberry, cherry)'
            })
            .type('json')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(200);
                expect(result.body).to.be.deep.equal(
                    {
                        id: 0,
                        name: 'Pinot noir',
                        year: 2011,
                        country: 'France',
                        type: 'red',
                        description: 'Sensual and understated (Strawberry, raspberry, cherry)'
                    });

                done();

            });
    });

    it('should respond with an error if some fields are invalid', function (done) {
        supertest(server)
            .put('/wines/0')
            .send({
                year: -1,
                type: 'invalid'
            })
            .type('json')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'VALIDATION_ERROR',
                    validation: {
                        type: 'INVALID',
                        year: 'INVALID'
                    }
                });

                done();

            });
    });

    it('should respond with an error if no entry exists', function (done) {
        supertest(server)
            .put('/wines/1')
            .set('Accept', 'application/json')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'UNKNOWN_OBJECT'
                });
                done();
            });
    });

});

describe('DELETE /wines/:id', function () {

    before(function (done) {
        setupMongoTestCollections({
            Wine: [
                {
                    name: 'Pinot noir',
                    year: 2011,
                    country: 'France',
                    type: 'red',
                    description: 'Sensual and understated'
                }
            ]
        }, done);
    });

    it('should respond with success if successfully deleted', function (done) {
        supertest(server)
            .del('/wines/0')
            .end(function (error, result) {

                expect(result.status).to.be.equal(200);
                expect(result.body).to.be.deep.equal({
                    success: true
                });

                supertest(server)
                    .get('/wines/')
                    .set('Accept', 'application/json')
                    .end(function (error, result) {

                        expect(result.status).to.be.equal(200);
                        expect(result.body.length).to.be.equal(0);
                        done();
                    });
            });
    });

    it('should respond with an error if no entry exists', function (done) {
        supertest(server)
            .del('/wines/1')
            .end(function (error, result) {

                expect(result.status).to.be.equal(400);
                expect(result.body).to.be.deep.equal({
                    error: 'UNKNOWN_OBJECT'
                });
                done();
            });
    });

});


function setupMongoTestCollections(fixtureData, done) {

    Wine.deleteMany({}, function (error) {
        if (error) {
            console.error(error);
        }
        Sequence.findOneAndUpdate({_id: 'WineSequence'}, {$set: {seq: 0}}, function (error) {
            if (error) {
                console.error(error);
            }
            fixtures(fixtureData, function (error) {
                if (error) {
                    console.error(error);
                }
                done();
            });

        });
    });
}