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
            response.send(wine.toJson());
            next();
        }

    });

};

module.exports = getWineHandler;