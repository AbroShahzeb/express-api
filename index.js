const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
    res.json({message: 'Hello world'})
})

app.get('/user', (req, res, next) => {
    res.json({id: 1, name: 'Shahzeb Abro', email: 'shahzeb@gmail.com'})
})

console.log('Hello world')

app.listen(3000, () => console.log('App is listening on port 3000'))