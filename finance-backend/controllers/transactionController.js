import Transaction from '../models/Transaction.js';

// GET all transactions for a user
export const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (err) {
    console.error('Error in getTransactionsByUser:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST add a new transaction
export const createTransaction = async (req, res) => {
  const { userId, type, amount, category, description, date } = req.body;
  try {
    const tx = new Transaction({ userId, type, amount, category, description, date });
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    console.error('Error in createTransaction:', err);
    res.status(400).json({ message: err.message });
  }
};

// PUT update a transaction
export const updateTransaction = async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  try {
    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, category, description, date },
      { new: true, runValidators: true } // Return the updated document and run validators
    );
    if (!updatedTx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(updatedTx);
  } catch (err) {
    console.error('Error in updateTransaction:', err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE a transaction
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('Error in deleteTransaction:', err);
    res.status(500).json({ message: err.message });
  }
};