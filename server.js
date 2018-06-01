const Restify = require('restify');

const PORT = process.env.PORT || 8080;

const server = Restify.createServer();

server.use(Restify.plugins.jsonBodyParser());

server.get('/hello/:name', require('./handler/hello'));

server.listen(PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
