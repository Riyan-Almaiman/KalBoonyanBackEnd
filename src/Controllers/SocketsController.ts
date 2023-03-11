import socketio, { Server } from 'socket.io';





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





