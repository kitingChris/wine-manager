const Wine = require('../model/Wine');

const listWineHandler = (request, response, next) => {

    const allowed = ['year', 'name', 'type', 'country'];

    const filter = Object.keys(request.query)
        .filter(key => allowed.includes(key))
        .reduce((filter, key) => {
            filter[key] = request.query[key];
            return filter;
        }, {});

    Wine.find(filter, function (error, wines) {
        if (error) {
            response.status(500);
            response.send({
                error: error.msg
            });
            next();
        } else {
            response.send(wines.map(wine => {
                return {
                    id: wine.id,
                    name: wine.name,
                    year: wine.year,
                    country: wine.country,
                    type: wine.type,
                    description: wine.description
                };
            }));
            next();
        }

    });

};



module.exports = listWineHandler;