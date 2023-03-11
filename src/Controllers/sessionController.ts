

import {Request, Response} from 'express';

import { PrismaClient } from '@prisma/client';
import socketio, { Server } from 'socket.io';

const prisma = new PrismaClient();



export const addUser = async (req:Request, res:Response) =>{
    try{
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
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}

export const getSessions = async (req:Request, res:Response) =>{
    try{
        const user = await prisma.session.findMany({
                    include:{

                        users:true
                    }
          });   
    }
    catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}








//socket
export default function socketServer(server: any) {

    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connect', async (socket) => {

        console.log("user connected")


        console.log(socket.id)

        socket.join("lobby");

        socket.on('sendMessage', (data) => {

            io.to("lobby").emit('receiveMessage', { from: socket.id, message: data.message });

        });

        socket.on('disconnect', () => {

            console.log(socket.id + ' disconnected');

        });


    });


}





