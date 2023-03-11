import express from 'express';
import { chatAPI } from '../Controllers/ChatGPT';

const router = express.Router();


router.post("/prompt", chatAPI)








export default router;
