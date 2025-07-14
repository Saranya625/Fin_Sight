import express from 'express';
import {
  getTransactionsByUser as getTransactions,
  createTransaction as addTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/:userId', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);

export default router;
