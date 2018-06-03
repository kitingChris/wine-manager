const Wine = require('../model/Wine');

const deleteWineHandler = (request, response, next) => {

    Wine.findOneAndDelete({id: request.params.id}, function (error, wine) {

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
            response.send({success: true});
            next();
        }

    });

};

module.exports = deleteWineHandler;