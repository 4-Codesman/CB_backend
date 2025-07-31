const User = require('../Models/StokvelUserModel');

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