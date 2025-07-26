const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savingLeagueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    status: String, //in discovery status refers to your poitns level eg Diamond, Gold, Silver. Hence users of the same status can join the same SL.
    // add more fields as necessary
    dueDate: { type: Date, required: true } // Date by which the saving league should be completed
})

const SavingLeague = mongoose.model('SavingLeague', savingLeagueSchema, 'SavingLeagues');
module.exports = SavingLeague;