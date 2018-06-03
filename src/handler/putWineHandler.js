const Wine = require('../model/Wine');
const WineType = require('../type/WineType');

const putWineHandler = (request, response, next) => {

    request.body = request.body || {}; // prevent exception

    const wineUpdate = {};
    const validationErrors = {};

    if(typeof request.body.name === 'string' && request.body.name.length > 0) {
        wineUpdate.name = request.body.name;
    }

    if(typeof request.body.year === 'number' && request.body.year.length > 0) {
        if(request.body.year > (new Date()).getFullYear() || request.body.year < 0 ) {
            validationErrors.year = 'INVALID';
        } else {
            wineUpdate.year = request.body.year;
        }
    }

    if(typeof request.body.country === 'string' && request.body.country.length > 0) {
        wineUpdate.country = request.body.country;
    }

    if(typeof request.body.type === 'string' && request.body.type.length > 0) {
        if(Object.keys(WineType).indexOf(request.body.type) === -1) {
            validationErrors.type = 'INVALID';
        } else {
            wineUpdate.type = request.body.type;
        }
    }

    if(Object.keys(validationErrors).length > 0) {
        response.status(400);
        response.send({
            error: 'VALIDATION_ERROR',
            validation: validationErrors
        });
        next();
    } else {

        Wine.findOne({id: request.params.id}, function (error, wine) {

            if (error) {
                response.status(500);
                response.send({
                    error: error.msg
                });
                next();
            } else if(!wine) {
                response.status(400);
                response.send({
                    error: 'UNKNOWN_OBJECT'
                });
                next();
            } else {
                wine.set(wineUpdate);
                wine.save(function (error, updatedWine) {
                    if (error){
                        return handleError(error);
                    }
                    response.send(updatedWine.toJson());
                    next();
                });
            }
        });
    }
};

module.exports = putWineHandler;