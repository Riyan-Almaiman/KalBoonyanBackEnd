import express from 'express';
import { addUser } from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { login } from '../Controllers/usersController';
const router = express.Router();


router.put("/join", auth, addUser)








export default router;
