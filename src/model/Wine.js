const mongoose = require('mongoose');
const WineType = require('../type/WineType');

const WineSequenceSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
});
const WineSequence = mongoose.model('WineSequence', WineSequenceSchema);

const WineSchema = new mongoose.Schema({
    id: {type: Number, unique: true},
    name: {type: String, required: true},
    year: {type: Number, required: true},
    country: {type: String, required: true},
    type: {type: String, enum: Object.keys(WineType), required: true},
    description: {type: String, default: ''}
});

WineSchema.pre('save', function (next) {
    const wineDoc = this;
    if (wineDoc.isNew) {
        WineSequence.findByIdAndUpdate({_id: 'WineSequence'}, {$inc: {seq: 1}}, {new: true, upsert: true})
            .then(function (wineSequence) {
                wineDoc.id = wineSequence.seq;
                next();
            })
            .catch(function (error) {
                console.error('sequence error: ', error);
                throw error;
            });
    } else {
        next();
    }
});

WineSchema.methods.toJson = function () {
    return {
        id: this.id,
        name: this.name,
        year: this.year,
        country: this.country,
        type: this.type,
        description: this.description
    };
};

const Wine = mongoose.model('Wine', WineSchema);

module.exports = Wine;