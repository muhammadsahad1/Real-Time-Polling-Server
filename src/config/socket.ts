import { Server } from 'socket.io';
import http from "http";

const createServer = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on('connection', (socket) => {
        console.log("Socket IO connected!");

        socket.on('joinPoll', (pollId: string) => {
            socket.join(pollId);
        });

        socket.on('vote', (pollId: string, optionIndex: number) => {
            socket.to(pollId).emit('voteUpdated', { optionIndex });
        });

        socket.on('sendMessage', (data) => {

            const { pollId, message, senderId, username } = data
            socket.to(pollId).emit('receiveMessage', {
                content: message, sender: {
                    _id: senderId, username: username
                }, poll: pollId

            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

export default createServer;
