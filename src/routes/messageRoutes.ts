import express, { Router, Request, Response } from 'express'
import { getMessages, sendMessage } from '../controllers/messageController'

const messageRoute = (io: any): Router => {
    const route: Router = express.Router()

    // route.get('/:pollId', (req: Request, res: Response) => getMessages(req, res, io))
    route.get('/:pollId', getMessages)
    route.post('/:pollId/:userId', sendMessage)

    return route
}

export default messageRoute