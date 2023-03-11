import express,{Application,Request,Response} from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ChatGPTRoutes from './Routes/ChatGPTRoutes'
import sessionRoutes from './Routes/sessionsRoutes'

import socketServer from './Controllers/sessionController';
import userRoutes from './Routes/userRoutes';

dotenv.config();

const app:Application = express();
app.use(cors());
app.use(express.json());

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
  });

socketServer(server)


app.use('/user', userRoutes)
app.use('/chat', ChatGPTRoutes)
app.use('/session', sessionRoutes)