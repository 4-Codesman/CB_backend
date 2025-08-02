const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savingLeagueSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String }, // e.g., Diamond, Gold
  dueDate: { type: Date, required: true }, // date league ends
  startDate: { type: Date, required: true }, // date league begins
  maxMembers: { type: Number, required: true },
  creatorUid: { type: String, required: true }, // Firebase UID or your user ID
  createdAt: { type: Date, default: Date.now }
});


const SavingLeague = mongoose.model('SavingLeague', savingLeagueSchema, 'SavingLeagues');
module.exports = SavingLeague;