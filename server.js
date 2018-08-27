const express = require('express')
const app = express()
const shortid = require('shortid')
const low = require('lowdb')
const cors = require('cors')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database/db.json')
const db = low(adapter)
const bodyParser = require('body-parser')


app.use(cors())
app.use(bodyParser.json())

app.get('/tiles', (req, res) => {
    res.send(db.get('tiles'))
})
app.post('/tiles', (req, res) => {
    try {
        db.set('tiles', req.body.tiles)
            .write()
        res.send(200)
    }
    catch (e) {
        res.send(500)
    }
})

app.delete('/tiles/:id', (req, res) => {
    console.log(req.params.id)
    try {
        db.get('tiles')
            .remove({ id: req.params.id })
            .write()
        res.send(200)
    }
    catch (e) {
        res.send(500)
    }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))