const User = require('../Models/userModel');
const Transaction = require('../Models/transactionModel');


exports.IncomingTransaction = async (req, res) => {
    const { uID, Amount, tag } = req.body;

    if (await User.exists({ userID: uID })) {
        try {
            const user = await User.findOne({ userID: uID }); // Correctly fetch the user

            if (!user) {
                return res.status(400).json({ message: 'User does not exist' });
            }

            // Ensure Amount is treated as a number
            const numericAmount = Number(Amount);
            if (isNaN(numericAmount)) {
                return res.status(400).json({ message: 'Invalid Amount value' });
            }

            // Update user balances
            if (tag === 'SavingsLeague') {
                user.SavingsLeague_Balance += numericAmount;
                user.accBalance += numericAmount;
                
            }else if (tag === 'Account') {
                user.accBalance += numericAmount;
            }

            // Save the updated user document
            await user.save();

            const trans = new Transaction({
                userID: uID,
                Amount: numericAmount,
                tag: tag,
                date: new Date()
            });

            if (await trans.save()) {
                return res.status(200).json({ message: 'Transaction successful' });
            } else {
                // Rollback changes if transaction fails
                if (tag === 'SavingsLeague') {
                    user.SavingsLeague_Balance -= numericAmount;
                    user.accBalance -= numericAmount;
                } else if (tag === 'Account') {
                    user.accBalance -= numericAmount;
                }
                await user.save(); // Save rollback changes
                return res.status(500).json({ message: 'Transaction failed' });
            }

            // add point recalculation logic here.

        } catch (error) {
            console.error('Mongo query error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }else{
        return res.status(400).json({ message: 'User does not exist'});
    }
}

exports.GetUserTransactions = async (req, res) => {
    const { uID } = req.params; // Extract uID from URL parameters

    if (await User.exists({ userID: uID })) {
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
};
