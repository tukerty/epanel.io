const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const low = require('lowdb')
const cors = require('cors')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database/db.json')
const db = low(adapter)
const bodyParser = require('body-parser')

db.defaults({ tiles: []})

app.use(cors())
app.use(bodyParser.json())

io.on('connection', function (socket) {
    console.log('New Connection');
    socket.on('tiles_changed', function (tiles) {
      socket.broadcast.emit('tiles_changed_event');
    });
});


app.get('/tiles', (req, res) => {
    res.send(db.get('tiles'))
})

app.post('/tiles', (req, res) => {
    try {
        db.set('tiles', req.body.tiles)
            .write()
        res.sendStatus(200)
    }
    catch (e) {
        res.sendStatus(500)
    }
})

app.delete('/tiles/:id', (req, res) => {
    console.log(req.params.id)
    try {
        db.get('tiles')
            .remove({ id: req.params.id })
            .write()
        res.sendStatus(200)
    }
    catch (e) {
        res.sendStatus(500)
    }
})

server.listen(3000, () => console.log('Example app listening on port 3000!'))