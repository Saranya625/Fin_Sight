import express from 'express';
import {
  getTransactionsByUser as getTransactions,
  createTransaction as addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/:userId', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction); // New route for updating transactions
router.delete('/:id', deleteTransaction);

export default router;