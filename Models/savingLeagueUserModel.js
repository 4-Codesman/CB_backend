const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savingLeagueUserSchema = new Schema({
  svl_id: { type: Schema.Types.ObjectId, ref: 'SavingLeague', required: true },
  user_id: { type: String, required: true }, // ✅ Changed from ObjectId to String to store Firebase UID
  goal: { type: Number, required: true }
});

module.exports = mongoose.models.SavingLeagueUser || mongoose.model('SavingLeagueUser', savingLeagueUserSchema, 'SavingLeagueUsers');
