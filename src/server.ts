import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/userRoutes'
import connectDB from './db/mongoDB'
dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello aliens');
});

app.use('/api/users', userRoute);
// app.use('/api/poll',)

app.listen(PORT, () => console.log(`server is running: => http://localhost:${PORT}`))
