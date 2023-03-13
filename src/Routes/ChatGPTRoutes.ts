import express from 'express';
import { chatAPI } from '../Controllers/ChatGPTController';



const router = express.Router();
router.post("/prompt", chatAPI)








export default router;
