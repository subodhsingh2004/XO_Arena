import { Server } from 'socket.io';

export const setupSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        },
    });

    return io;
}