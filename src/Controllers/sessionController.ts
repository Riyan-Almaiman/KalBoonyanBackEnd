
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import socketio, { Server } from 'socket.io';

const prisma = new PrismaClient();



export const addUser = async (req:Request, res:Response) =>{
    try{
        console.log(req.body)
        const user = await prisma.session.update({
            where: {
              id: req.body.id
            },
            data: {
              users: {
                connect: {
                  id: res.locals.user.id
                },
              },
            }
          });  
          res.json({msg:user})
 
    }
    catch(e){
        console.log("error")
        res.status(500).json({msg:`Error: ${e}`});
    }
}

export const getSessions = async (req:Request, res:Response) =>{
    try{
        const sessions = await prisma.session.findMany({
                    include:{

                        users:true
                    }
          });   
          console.log(sessions)
          res.json(sessions)
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}




export const createSession = async (req:Request, res:Response) =>{

    if(res.locals.user.role!="SUPPORTER"){return}
    try{

        
        const sessions = await prisma.session.create({


            data:{
                topic: req.body.topic,
                Leader: res.locals.user.username
            }
                 
          });   
          console.log(sessions)
          res.json(sessions)
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}




//socket
export default function socketServer(server: any) {

    let id:string; 
    const io = new Server(server, { cors: { origin: '*' } });
    const webrtc = io.of('/webrtc');

    webrtc.on('connection', (socket) => {
      console.log('A WebRTC client connected');
    });
    
    io.on('connect', async (socket) => {

        console.log("user connected")



        socket.on('sendMessage', (data) => {

            console.log(data)
            socket.to(data.group).emit('receiveMessage', { group: id, message: data.message });

        });
        socket.on('join',(data)=>{
            id= data.sessionId;
            socket.join(id);
            

        })

        socket.on('disconnect', () => {

            console.log(socket.id + ' disconnected');

        });


    });


}






