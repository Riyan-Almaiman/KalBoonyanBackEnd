import express,{Application,Request,Response} from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ChatGPTRoutes from './Routes/ChatGPTRoutes'
import sessionRoutes from './Routes/sessionsRoutes'

import socketServer from './Controllers/sessionController';
import userRoutes from './Routes/userRoutes';

import { connectDB } from './config/db';
import path from 'path';


dotenv.config();

const app:Application = express();
app.use(cors());
app.use(express.json());
app.use(express.static('react'))
connectDB()

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "react", "index.html"));
});

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
  });



socketServer(server)


app.use('/user', userRoutes)
app.use('/chat', ChatGPTRoutes)
app.use('/session', sessionRoutes)