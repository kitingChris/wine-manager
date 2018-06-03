const Wine = require('../model/Wine');
const WineType = require('../type/WineType');

const postWineHandler = (request, response, next) => {

    request.body = request.body || {}; // prevent exception

    const validationErrors = {};

    if(typeof request.body.name !== 'string' || request.body.name.length === 0) {
        validationErrors.name = 'MISSING';
    }

    if(typeof request.body.year !== 'number' || request.body.year.length === 0) {
        validationErrors.year = 'MISSING';
    } else if(request.body.year > (new Date()).getFullYear() || request.body.year < 0 ) {
        validationErrors.year = 'INVALID';
    }

    if(typeof request.body.country !== 'string' || request.body.country.length === 0) {
        validationErrors.country = 'MISSING';
    }

    if(typeof request.body.type !== 'string' || request.body.type.length === 0) {
        validationErrors.type = 'MISSING';
    } else if(Object.keys(WineType).indexOf(request.body.type) === -1) {
        validationErrors.type = 'INVALID';
    }

    if(Object.keys(validationErrors).length > 0) {
        response.status(400);
        response.send({
            error: 'VALIDATION_ERROR',
            validation: validationErrors
        });
        next();
    } else {

        const wine = new Wine({
            name: request.body.name,
            year: request.body.year,
            country: request.body.country,
            type: request.body.type,
            description: request.body.description || '',
        });

        wine.save(function (error) {
            if (error) {
                if (error.code === 11000) {
                    response.status(409);
                    response.send({
                        error: 'CONFLICT_ERROR'
                    });
                    next();
                }
                else {
                    console.error(error);
                    response.status(500);
                    response.send({
                        error: 'PERSISTANCE_ERROR'
                    });
                    next();
                }
            }
            else {
                response.send(wine.toJson());
                next();
            }
        });
    }
};

module.exports = postWineHandler;