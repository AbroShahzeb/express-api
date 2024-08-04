const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
    res.json({message: 'Hello world'})
})

console.log('Hello world')

app.listen(3000, () => console.log('App is listening on port 3000'))