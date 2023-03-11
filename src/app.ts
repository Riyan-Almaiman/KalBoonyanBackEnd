import express,{Application,Request,Response} from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ChatGPTRoutes from './Routes/ChatGPTRoutes'
import socketServer from './Controllers/SocketsController';

dotenv.config();

const app:Application = express();
app.use(cors());
app.use(express.json());

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
  });

socketServer(server)



app.use('/chat', ChatGPTRoutes)