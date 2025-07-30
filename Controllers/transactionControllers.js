const User = require('../Models/userModel');
const Transaction = require('../Models/transactionModel');


exports.IncomingTransaction =  async (req, res) => {

    const {uID, Amount, tag } = req.body;

    if (User.exists({ userID: uID })) {
        try {
            const user = await User.find;
            
            if (tag === 'SavingsLeague') {
                user.SavingsLeague_Balance += Amount;
                user.Total_Balance += Amount;
            }else if (tag === 'Account') {
                user.Total_Balance += Amount;
            }

            const trans = new Transaction({
                userID: uID,
                Amount: Amount,
                tag: tag,
                date: new Date()
            });

            if (await trans.save()){
                return res.status(200).json({ message: 'Transaction sucessful'});
            }else{
                if (tag === 'SavingsLeague') {
                    user.SavingsLeague_Balance -= Amount;
                    user.Total_Balance -= Amount;
                }else if (tag === 'Account') {
                    user.Total_Balance -= Amount;
                }
                return res.status(500).json({ message: 'Transaction failed'});
            }

            // add point recalculation logic here.

        } catch (error) {
            console.error('Mongo querry error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }else{
        return res.status(400).json({ message: 'User does not exist'});
    }
}