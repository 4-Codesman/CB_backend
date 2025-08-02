const Stokvel = require('../Models/StokvelModel');
const StokvelUser = require('../Models/StokvelUserModel');
const User = require('../Models/UserModel');

exports.checkUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email not stored in memory' });
    }

    const user = await StokvelUser.find({ user_email: email, status: 1 }).populate('sv_id', 'name');

    if (!user || user.length === 0) {
      return res.status(200).json({ stokvels: [] });
    }

    const stokvels = user
      .filter(u => u.sv_id && u.sv_id.name)
      .map(u => ({ id: u.sv_id._id, name: u.sv_id.name }));

    res.json({ stokvels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

function getNextPayout(startDate, period) {
  const now = new Date();
  let next = new Date(startDate);

  while (next <= now) {
    switch (period.toLowerCase()) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(next.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'annually':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        return null;
    }
  }

  return next;
}
exports.getStokvelsForUser= async (req, res) => {
  try {
    const stokvelId = req.params.id;
    const userEmail = req.query.email;

    console.log('Received request for stokvelId:', stokvelId, 'userEmail:', userEmail);

    const stokvel = await Stokvel.findById(stokvelId);
    console.log('Found stokvel:', stokvel);

    if (!stokvel) {
      console.log('No stokvel found with ID:', stokvelId);
      return res.status(404).json({ error: 'Stokvel not found' });
    }

    const userEntry = await StokvelUser.findOne({ sv_id: stokvelId, user_email: userEmail });
    console.log('User entry for stokvel:', userEntry);

    const members = await StokvelUser.find({ sv_id: stokvelId }).sort({ position: 1 });
    console.log('Members found:', members);

    const emails = members.map(m => m.user_email);
    const users = await User.find({ userEmail: { $in: emails } }).select('userEmail userName');
    
    const emailNameMap = {};
    users.forEach(u => {
      emailNameMap[u.userEmail.toLowerCase()] = u.userName;
    });
    

    const detailedMembers = members.map((m) => ({
      email: m.user_email,
      position: m.position,
      name: emailNameMap[m.user_email] || 'Unknown'
    }));
    console.log('Detailed members:', detailedMembers);

    const nextPayout = getNextPayout(stokvel.date, stokvel.period);
    console.log('Next payout calculated:', nextPayout);

    res.status(200).json({
      name: stokvel.name,
      amount: stokvel.amount,
      period: stokvel.period,
      startDate: stokvel.date,
      nextPayout,
      yourPosition: userEntry?.position ?? null,
      members: detailedMembers
    });
  } catch (err) {
    console.error('Error fetching stokvel details:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
