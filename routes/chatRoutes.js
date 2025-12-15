import express from 'express';
import { saveChatSession } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', saveChatSession);

export default router;
