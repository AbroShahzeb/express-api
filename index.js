import dotenv from "dotenv"
dotenv.config()

import User from './models/userModel.js'


import express from "express"
const app = express()

import { connectDB } from "./utils/db.js"

app.get('/', async (req, res, next) => {
    
    res.json({message: 'Hello from the app'})
})

app.get('/user', async (req, res, next) => {
    const users = await User.find()
    res.json({status: 'success', results: users.length, data: users})
})

app.get('/create-user', async (req, res, next) => {
    await User.create({name: 'Shahzeb Abro'})
    res.json('user created')
})

connectDB().then(() => {

    app.listen(3000, () => console.log('App is listening on port 3000'))
})
