import express from 'express';
import { addUser, createSession, getSessions, getSession, getSessionsProfile, getSuggestions, createSuggestion} from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { login } from '../Controllers/usersController';
const router = express.Router();


router.put("/join", auth, addUser)

router.get("/", getSessions)

router.get("/:sessionId", getSession)

router.post("/create", auth, createSession)

router.get("/profile/sessions", auth, getSessionsProfile)

router.get("/suggestions/all", getSuggestions)

router.post("/suggestions",  createSuggestion)








export default router;
