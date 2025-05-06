import { Server } from 'socket.io';

export const setupSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        },
    });

    return io;
}