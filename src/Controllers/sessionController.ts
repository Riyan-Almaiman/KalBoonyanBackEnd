
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import socketio, { Server } from 'socket.io';
import { transporter } from './EmailController';


const prisma = new PrismaClient();


let users:any = {};



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

export const getSession = async (req:Request, res:Response) =>{
    try{
        const session = await prisma.session.findUnique({
                    
                    where:{
                        id: req.params.sessionId
                    },
                    include:{

                        users:true
                    }
          });   
          res.json(session)
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}






export const createSession = async (req:Request, res:Response) =>{



    if(res.locals.user.role!="SUPPORTER"){return}
    let date = new Date(req.body.date)
    date.setHours(date.getHours()+3)

    try{

        
        const session = await prisma.session.create({


            data:{
                date: date,
                topic: req.body.topic,
                Leader: res.locals.user.name,
                description: req.body.description
            }
                 
          });   
          console.log("session created: " + session)

          try{
        transporter.sendMail({
            from: "Kalboonyanmarsoos@gmail.com",
            to: res.locals.user.email,
            subject: "Session Created",
            text: "Session: "+session.topic +"Created. Session Date: "+ session.date?.toISOString()


        })}catch{
            console.log("invalid email")
        }
          res.json(session)
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}




//socket
export default function socketServer(server: any) {

    let id:string; 
    const io = new Server(server, { cors: { origin: '*' } });
   
    io.on('connect', async (socket) => {

        console.log("user connected")


        socket.on('sendMessage', (data) => {

            console.log(data)
            socket.to(id).emit('receiveMessage', { user: data.user, text: data.text, isSent:false });

        });

        socket.on('join',(data)=>{    
            users[socket.id] = data.username;
            id= data.sessionId;
            socket.join(id);
            socket.to(data.sessionId).emit('userJoined', {username: data.username});
            socket.emit('users', {users: users})


        })

        socket.on('disconnect', () => {

            const username = users[socket.id];
            console.log(username)
            console.log(`User ${socket.id} disconnected`);
        
            delete users[socket.id];
            io.to(id).emit('userLeft', { username: username });
          });


    });


}






