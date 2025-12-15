import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

// Public route - Submit feedback
router.post('/', createFeedback);

// Admin routes - Manage feedbacks
router.get('/', getAllFeedbacks);
router.get('/:id', getFeedbackById);
router.patch('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;

