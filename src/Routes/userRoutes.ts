import express from 'express';
import { addUser } from '../Controllers/sessionController';
import auth from '../Middleware/auth'
import { createUser, getUser, login } from '../Controllers/usersController';
const router = express.Router();


router.post("/login", login)
router.post("/create", createUser)
router.get("/", auth, getUser)








export default router;
