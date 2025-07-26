const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stokvelUserSchema = new Schema({
    sv_id: { type: Schema.Types.ObjectId, ref: 'Stokvel', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: Number, required: ture}
})

const StokvelUser = mongoose.model('StokvelUser', stokvelUserSchema, 'StokvelUsers');
module.exports = StokvelUser;

// Links users to a stokvel in a way we can easily alter the order of their position in the stokvel
// This is useful for things like leaderboards or determining who gets paid out first
