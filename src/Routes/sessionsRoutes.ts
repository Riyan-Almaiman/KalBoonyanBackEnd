import express from 'express';
import { addUser } from '../Controllers/sessionController';
import auth from '../Middleware/auth'
const router = express.Router();


router.post("/join", auth, addUser)








export default router;
