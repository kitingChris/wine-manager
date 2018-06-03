const restify = require('restify');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

const server = restify.createServer();

server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.queryParser());

server.get('/wines/', require('./handler/listWineHandler'));
server.post('/wines/', require('./handler/postWineHandler'));
//server.get('/wines/:id', require('./handler/getWineHandler'));
server.put('/wines/:id', require('./handler/putWineHandler'));
//server.del('/wines/:id', require('./handler/deleteWineHandler'));

mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));

server.listen(PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});