const restify = require('restify');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

const server = restify.createServer();

server.use(restify.plugins.jsonBodyParser());

server.post('/wines/', require('./handler/postWineHandler'));

mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));

server.listen(PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});