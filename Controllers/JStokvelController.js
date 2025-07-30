const User = require('../Models/StokvelUserModel');

exports.checkRequestsByEmail= async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email not stored in memory'});
      }
  
      const user = await User.find({ user_email:email, status:0 });
  
      if (!user || user.length === 0) {
        return res.status(200).json({ stokvels: [] });
      }

      const stokvelIds = user.map(userDoc => userDoc.sv_id);
  
      res.json({ stokvels: stokvelIds });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };