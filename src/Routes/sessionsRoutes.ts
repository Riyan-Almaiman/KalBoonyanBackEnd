import express from 'express';
import { addUser, createSession, getSessions } from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { login } from '../Controllers/usersController';
const router = express.Router();


router.put("/join", auth, addUser)

router.get("/", getSessions)

router.put("/create", createSession)






export default router;
