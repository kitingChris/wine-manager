const expect = require('chai').expect;

const Wine = require('../src/model/Wine');
const WineType = require('../src/type/WineType');

describe('Model Wine', function() {
    it('should be invalid if name is empty', function(done) {
        const wine = new Wine({
            name: '',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if year is empty', function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });
        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.year).to.exist;
            done();
        });
    });
    it('should be invalid if year is not numeric', function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            year: 'invalid',
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });
        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.year).to.exist;
            done();
        });
    });
    it('should be invalid if country is empty', function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: '',
            type: 'red',
            description: 'Sensual and understated'
        });
        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.country).to.exist;
            done();
        });
    });
    it('should be invalid if type is empty', function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: '',
            description: 'Sensual and understated'
        });
        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.type).to.exist;
            done();
        });
    });
    it('should be invalid if type is not one of [%s]'.replace('%s', Object.keys(WineType)), function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'invalid',
            description: 'Sensual and understated'
        });
        wine.validate(function(err) {
            // noinspection BadExpressionStatementJS
            expect(err.errors.type).to.exist;
            done();
        });
    });
    it('should be valid if description is empty', function(done) {
        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: ''
        });
        wine.validate(function(err) {
            expect(err).to.be.a('null');
            done();
        });
    });
});