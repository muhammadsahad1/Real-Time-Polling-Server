import express, { Router } from 'express'
import { createPoll } from '../controllers/pollController'

const pollRoute : Router = express.Router()

pollRoute.post('/creatPoll',createPoll)