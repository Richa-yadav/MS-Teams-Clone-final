const express = require('express') //to start the server
const app = express() //initializing express
const server = require('http').Server(app)
const io = require('socket.io')(server) //for real-time data connection
const { v4: uuidv4 } = require('uuid'); //for generating unique url
const { ExpressPeerServer } = require('peer'); //for specific version of npm package
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

//this is where our application is going to live, when we hit any particular url
app.get('/', (req, res) =>{
    res.redirect(`/${uuidv4()}`);
})

//passing the unique uuid to the front
app.get('/:room', (req, res) =>{
    res.render('room', { roomId: req.params.room});
} )


//user will join the room
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})





server.listen(process.env.PORT || 3000)