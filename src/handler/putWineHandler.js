const Wine = require('../model/Wine');
const WineType = require('../type/WineType');

const putWineHandler = (request, response, next) => {

    const data = request.body || {};

    const wineUpdate = {};
    const validationErrors = {};

    if(typeof data.name === 'string' && data.name.length > 0) {
        wineUpdate.name = data.name;
    }

    if(typeof data.year === 'number') {
        if(data.year > (new Date()).getFullYear() || data.year < 0 ) {
            validationErrors.year = 'INVALID';
        } else {
            wineUpdate.year = data.year;
        }
    }

    if(typeof data.country === 'string' && data.country.length > 0) {
        wineUpdate.country = data.country;
    }

    if(typeof data.type === 'string' && data.type.length > 0) {
        if(Object.keys(WineType).indexOf(data.type) === -1) {
            validationErrors.type = 'INVALID';
        } else {
            wineUpdate.type = data.type;
        }
    }

    if(typeof data.description === 'string' && data.description.length > 0) {
        wineUpdate.description = data.description;
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
                    if (error) {
                        console.error(error);
                        response.status(500);
                        response.send({
                            error: 'PERSISTANCE_ERROR'
                        });
                        next();
                    }
                    response.send({
                        id: updatedWine.id,
                        name: updatedWine.name,
                        year: updatedWine.year,
                        country: updatedWine.country,
                        type: updatedWine.type,
                        description: updatedWine.description
                    });
                    next();
                });
            }

        });

    }
};

module.exports = putWineHandler;