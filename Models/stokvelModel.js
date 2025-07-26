const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stokvelSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String
})

const Stokvel = mongoose.model('Stokvel', stokvelSchema, 'Stokvels');
module.exports = Stokvel;