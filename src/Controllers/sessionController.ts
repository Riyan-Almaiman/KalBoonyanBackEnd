
import {Request, Response} from 'express';
import {prisma} from '../config/db';
import socketio, { Server } from 'socket.io';
import { transporter } from './EmailController';
import { Session } from 'inspector';




let users:any = {};



export const addUser = async (req:Request, res:Response) =>{
    try{
     
           
       const session = await prisma.session.update({
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
          try{
          transporter.sendMail({
            from: "Kalboonyanmarsoos@gmail.com",
            to: res.locals.user.email,
            subject: "Session Created",
            text: "Session Joined: "+session.topic +"Session Date: "+ session.date?.toISOString()   


        }).then(console.log)
        .catch(console.error);}catch{
            console.log("invalid email")
        }
        const sessions = await prisma.session.findMany({
            include:{

                users:true
            }
  });   
  res.json({sessions: sessions})


          
 
    }
    catch(e){
        console.log("error")
        res.status(500).json({msg:`Error: ${e}`});
    }
}

export const createSuggestion = async (req: Request, res: Response) => {
  

    const sessions = await prisma.suggestion.create({
    
            data:{

                  topic:req.body.topic

            }
    
    
    }

   
    )
  }

  export const getSuggestions = async (req: Request, res: Response) => {
  

    const suggestions = await prisma.suggestion.findMany( )
    res.json(suggestions)
  }

  
export const getSessions = async (req:Request, res:Response) =>{
    try{
        const sessions = await prisma.session.findMany({
                    include:{

                        users:true
                    }
          });   
          res.json({sessions: sessions})
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}



export const getSessionsProfile = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.user.id; // get the user's ID from the token
  
      const sessions = await prisma.session.findMany({
        include: {
          users: true
        },
        where: {
          users: {
            some: {
              id: userId
            }
          }
        }
      });
  
      res.json({sessions: sessions} );
    } catch (e) {
      res.status(500).json({ msg: `Error: ${e}` });
    }
  };


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
          res.json({session: session})
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
                description: req.body.description,
                type: req.body.type
            }
                 
          });   
          console.log("session created: " + session)

          try{
        transporter.sendMail({
            from: "Kalboonyanmarsoos@gmail.com",
            to: res.locals.user.email,
            subject: "Session Created",
            text: "<p>Session: "+session.topic +"Created. </p> <p>Session Date: "+ session.date?.toISOString()+"</p>"


        }).then(console.log)
        .catch(console.error);}catch{
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

        socket.on('audio-stream', (data) => {
          socket.to(id).emit('audio-stream', data.audioData);
        });

        socket.on('disconnect', () => {

            const username = users[socket.id];
            console.log(username)
            console.log(`User ${socket.id} disconnected`);
        
            delete users[socket.id];
            io.to(id).emit('userLeft', { username: username });
          });


    });


}






