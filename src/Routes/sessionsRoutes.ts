import express from 'express';
import { addUser, createSession, getSessions, getSession} from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { login } from '../Controllers/usersController';
const router = express.Router();


router.put("/join", auth, addUser)

router.get("/", getSessions)

router.get("/:sessionId", getSession)

router.post("/create", auth, createSession)






export default router;
