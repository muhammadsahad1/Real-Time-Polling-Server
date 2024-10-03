import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/userRoutes'
import connectDB from './db/mongoDB'
import pollRoute from './routes/pollRoutes'
import createServer from './config/socket'
import http from "http"
import messageRoute from './routes/messageRoutes'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
connectDB()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json())

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello aliens');
});

const server = http.createServer(app)

const io = createServer(server)
app.use('/api/users', userRoute);
app.use('/api/polls', pollRoute(io))    
app.use('/api/messages', messageRoute(io))


server.listen(PORT, () => console.log(`server is running: => http://localhost:${PORT}`))
