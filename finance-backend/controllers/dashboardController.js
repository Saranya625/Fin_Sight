import Transaction from '../models/Transaction.js';

export const getDashboardStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId });

    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);

    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => acc + tx.amount, 0);

    const balance = income - expenses;

    const categoryMap = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      }
    });

    res.json({ income, expenses, balance, categories: categoryMap });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
