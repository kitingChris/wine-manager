const Wine = require('../model/Wine');

const getWineHandler = (request, response, next) => {

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

};

module.exports = getWineHandler;