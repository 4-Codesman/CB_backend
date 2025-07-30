const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stokvelSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true }, //let Mongoose handle ID
    name: { type: String, required: true },
    type: { type: Number, required: true }, //0 = traditional, 1=interest
    amount: { type: Number, required: true },
    period: { type: String, required: true },
    date: { type: Date, required: true },
    members: [{ type: String, required: true }],
    status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Stokvel', stokvelSchema, 'Stokvels');
