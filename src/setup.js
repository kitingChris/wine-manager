const mongoose = require('mongoose');
const fixtures = require('node-mongoose-fixtures');
const Wine = require('./model/Wine');
const Sequence = require('./model/Sequence');

const NODE_ENV = process.env.NODE_ENV || 'production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wine-manager-test';

if(NODE_ENV === 'production' || NODE_ENV === 'prod') {
    throw new Error('Setup is only intended to be executed in non production environment.');
}

mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));

function done() {
    console.info('Setup finished.');
}

Wine.deleteMany({}, function (error) {
    if (error) {
        console.error(error);
    }
    console.info('Wine.deleteMany({}) done.');
    Sequence.findOneAndUpdate({_id: 'WineSequence'}, {$set: {seq: 0}}, function (error) {
        if (error) {
            console.error(error);
        }
        console.info('Sequence.findOneAndUpdate({_id: \'WineSequence\'}, {$set: {seq: 0}}) done.');
        fixtures({
            Wine: [
                {
                    id: 0,
                    name: 'Cabernet sauvignon',
                    year: 2013,
                    country: 'France',
                    type: 'red',
                    description: 'The Sean Connery of red wines'
                },
                {
                    id: 1,
                    name: 'Pinot noir',
                    year: 2011,
                    country: 'France',
                    type: 'red',
                    description: 'Sensual and understated'
                },
                {
                    id: 2,
                    name: 'Zinfandel',
                    year: 1990,
                    country: 'Croatia',
                    type: 'red',
                    description: 'Thick and jammy'
                }
            ]
        }, function (error) {
            if (error) {
                console.error(error);
            }
            console.info('fixtures done.');
            done();
        });

    });
});