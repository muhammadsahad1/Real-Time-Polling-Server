import express, { Router } from 'express'
import { createPoll, getPolls } from '../controllers/pollController'

const pollRoute : Router = express.Router()

pollRoute.post('/createPoll',createPoll)
pollRoute.get('/',getPolls)
pollRoute.post('/polls/vote',)

export default pollRoute