import { Server } from 'socket.io'
import http from "http";

const createServer = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    io.on('connection', (socket) => {
        console.log("socket IO connected -!")

        socket.on('sendMessage', (pollId: string, message: string) => {
            socket.to(pollId).emit('receiveMessage', message)
        })

        socket.on('vote', (pollId: string, optionIndex: number) => {
            socket.to(pollId).emit('voteUpdated', { optionIndex })
        })

        socket.on('joinPoll', (pollId: string) => {
            socket.join(pollId)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        })
    })
}

export default createServer 