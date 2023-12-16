import express from 'express';
const aiRouter = express.Router();

import { chatGPT } from '../controllers/aiController.js';

aiRouter.post('/chat', chatGPT);

export default aiRouter;
