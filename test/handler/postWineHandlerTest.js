const sinon = require('sinon');
const Wine = require('../../src/model/Wine');
const postWineHandler = require('../../src/handler/postWineHandler');

describe('postWineHandler', function () {

    const response = {
        status: function () {},
        send: function () {}
    };
    const responseMock = sinon.mock(response);
    const wineSaveMock = sinon.mock(Wine.prototype);
    const fakeWine = {
        name: 'Pinot noir',
        year: 2011,
        country: 'France',
        type: 'red',
        description: ''
    };
    sinon.stub(Wine.prototype, 'toJson').returns(fakeWine);

    it('should respond with validation error if body is invalid', function (done) {
        const request = {
            body: {}
        };

        responseMock.expects('status').once().withExactArgs(400);
        responseMock.expects('send').once().withExactArgs({
            error: 'VALIDATION_ERROR',
            validation: {
                country: 'MISSING',
                name: 'MISSING',
                type: 'MISSING',
                year: 'MISSING'
            }
        });

        postWineHandler(request, response, function () {});

        responseMock.verify();
        done();
    });
    it('should save the entity if body is valid', function (done) {
        const request = {
            body: fakeWine
        };

        postWineHandler(request, response, function () {});

        wineSaveMock.expects('save').once();

        done();
    });
});