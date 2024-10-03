import express, { Router, Request, Response } from 'express'
import { createPoll, getPolls, voting } from '../controllers/pollController'

const pollRoute = (io: any): Router => {
    const router: Router = express.Router();


    router.post('/createPoll', createPoll);
    router.get('/', getPolls);
    router.post('/:pollId/:userId/vote', (req: Request, res: Response) => voting(req, res,io));

    return router;
};

export default pollRoute