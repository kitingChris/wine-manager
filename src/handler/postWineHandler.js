const Wine = require('../model/Wine');
const WineType = require('../type/WineType');

const postWineHandler = (request, response, next) => {

    const data = request.body || {};

    const validationErrors = {};

    if(typeof data.name !== 'string' || data.name.length === 0) {
        validationErrors.name = 'MISSING';
    }

    if(typeof data.year !== 'number' || data.year.length === 0) {
        validationErrors.year = 'MISSING';
    } else if(data.year > (new Date()).getFullYear() || data.year < 0 ) {
        validationErrors.year = 'INVALID';
    }

    if(typeof data.country !== 'string' || data.country.length === 0) {
        validationErrors.country = 'MISSING';
    }

    if(typeof data.type !== 'string' || data.type.length === 0) {
        validationErrors.type = 'MISSING';
    } else if(Object.keys(WineType).indexOf(data.type) === -1) {
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
            name: data.name,
            year: data.year,
            country: data.country,
            type: data.type,
            description: data.description || '',
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
                response.send({
                    id: wine.id,
                    name: wine.name,
                    year: wine.year,
                    country: wine.country,
                    type: wine.type,
                    description: wine.description
                });
                next();
            }
        });
    }
};

module.exports = postWineHandler;