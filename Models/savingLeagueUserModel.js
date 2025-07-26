const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const savingLeagueUserSchema = new Schema({
    svl_id: { type: Schema.Types.ObjectId, ref: 'SavingLeague', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: Number, required: true }

})

const SavingLeagueUser = mongoose.model('SavingLeagueUser', savingLeagueUserSchema, 'SavingLeagueUsers');
module.exports = SavingLeagueUser;