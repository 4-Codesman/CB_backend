const User = require('../Models/StokvelUserModel');
const Stokvel = require('../Models/stokvelModel');

exports.checkRequestsByEmail= async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email not stored in memory'});
      }
  
      const user = await User.find({ user_email:email, status:0 }).populate('sv_id', 'name');
  
      if (!user || user.length === 0) {
        return res.status(200).json({ stokvels: [] });
      }

      const stokvels = user.filter(u => u.sv_id && u.sv_id.name) // safeguard
      .map(u => ({
        id: u.sv_id._id,
        name: u.sv_id.name
      }));
  
      res.json({ stokvels});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.InviteResponse = async (req, res) => {
    try {
      const {stokvelId, email, accepted}=req.body;
  
      if (!email || !stokvelId ||typeof accepted !== 'boolean') {
        return res.status(400).json({error: 'Missing data'});
      }
  
      const user=await User.findOneAndUpdate(
        { user_email: email, sv_id: stokvelId },
        { status: accepted? 1 : 2 },
        { new: true }
      );
  
      if (!user) 
      {
        return res.status(404).json({ error: 'User AFK'});
      }
  
      res.json({ message: 'Response recorded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  exports.getStokvelDetails = async (req, res) => {

    const { stokvelId } = req.params;  // get ID from URL
  try {
    const stokvel = await Stokvel.findById(stokvelId);
    if (!stokvel) return res.status(404).json({ error: 'No such Stokvel'});
    res.json(stokvel);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};