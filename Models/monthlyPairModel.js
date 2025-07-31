const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthlyPairSchema = new Schema({
  pairID: { type: String, required: true, unique: true }, // e.g. "sipho123-zayd456-2025-07"
  userA_ID: { type: String, required: true },
  userA_Name: { type: String, required: true },
  userB_ID: { type: String, required: true },
  userB_Name: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "2025-07"
  sharedGoal: { type: Number, default: 100 },
  progress: { type: Number, default: 0 }
});

const MonthlyPair = mongoose.model('MonthlyPair', monthlyPairSchema, 'MonthlyPairs');
module.exports = MonthlyPair;
