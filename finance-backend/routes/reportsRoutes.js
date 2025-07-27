import express from 'express';
import { generateReport } from '../controllers/reportsController.js';

const router = express.Router();

router.post('/:userId', generateReport);

export default router;
