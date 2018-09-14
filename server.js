const express = require('express')
const fs = require('fs')
const https = require('https');
const http = require('http');
const low = require('lowdb')
const cors = require('cors')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database/db.json')
const db = low(adapter)
const bodyParser = require('body-parser')
const app = express()

/* const certificate = fs.readFileSync( '/etc/letsencrypt/live/tukerty.ru/fullchain.pem' );
const privateKey = fs.readFileSync( '/etc/letsencrypt/live/tukerty.ru/privkey.pem' );
const server = https.createServer({ key: privateKey, cert: certificate }, app).listen(443);
*/
const server = http.createServer(app).listen(3000);
const io = require('socket.io')(server);




db.defaults({ tiles: [], envs: []})

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('dist'))

io.on('connection', function (socket) {
    console.log('New Connection');
    socket.on('tiles_changed', function (tiles) {
      socket.broadcast.emit('tiles_changed_event');
    });
});

app.get('/api/envs', (req, res) => {
    res.send(db.get('tiles'))
})

app.get('/api/tiles', (req, res) => {
    res.send(db.get('tiles'))
})

app.post('/api/tiles', (req, res) => {
    try {
        db.set('tiles', req.body.tiles)
            .write()
        res.sendStatus(200)
    }
    catch (e) {
        res.sendStatus(500)
    }
})

app.delete('/api/tiles/:id', (req, res) => {
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
