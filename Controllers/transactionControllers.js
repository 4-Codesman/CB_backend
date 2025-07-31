const User = require('../Models/userModel');
const Transaction = require('../Models/transactionModel');


exports.IncomingTransaction =  async (req, res) => {

    const {uID, Amount, tag } = req.body;

    if (User.exists({ userID: uID })) {
        try {
            const user = await User.find;
            
            if (tag === 'SavingsLeague') {
                user.SavingsLeague_Balance += Amount;
                user.accBalance += Amount;
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
                    user.accBalance -= Amount;
                }else if (tag === 'Account') {
                    user.accBalance -= Amount;
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

exports.GetUserTransactions = async (req, res) => {
    const { uID } = req.body;

    if ( await User.exists({ userID: uID })) {
        try {
            const transactions = await Transaction.find({ userID: uID }).sort({ date: -1 });

            if (transactions.length > 0) {
                return res.status(200).json(transactions);
            } else {
                return res.status(200).json({ message: 'No transactions found for this user' });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(400).json({ message: 'User does not exist' });
    }
}
