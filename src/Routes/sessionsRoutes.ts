import express from 'express';
import { addUser, createSession, getSessions, getSession, getSessionsProfile} from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { login } from '../Controllers/usersController';
const router = express.Router();


router.put("/join", auth, addUser)

router.get("/", getSessions)

router.get("/:sessionId", getSession)

router.post("/create", auth, createSession)

router.get("/profilesessions", auth, getSessionsProfile)






export default router;
