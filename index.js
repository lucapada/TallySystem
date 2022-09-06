const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Atem = require('atem')
const myAtem = new Atem()
const { config } = require('dotenv');
const path = require("path");

config();

var atemStatus = {
    PROGRAM: 0,
    PREVIEW: 0
};

app.use('/res', express.static('client'));
app.use("/node_modules", express.static(path.join(__dirname, '/node_modules/')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/qrcode.html');
});
app.get('/monitor', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

const sockets = []
io.on('connection', (socket) => {
    // client connected
    console.log('A user connected with socket id: ' + socket.id);
    sockets[socket.id] = {} 
    
    // client disconnected
    socket.on('disconnect', () => {
        delete sockets[socket.id];
        console.log(socket.id + ' disconnected');
    });

    // client typed name and camera no
    socket.on('joinCamera', (data) => {
        console.log("Socket " + data.id + "'s name is " + data.name + ", linked to camera #" + data.cameraId);
        sockets[data.id] = { name: data.name, cameraId: data.cameraId }
        sendStatus();
        // send streaming
        socket.emit("streaming", process.env.STREAMING_URL);
    });
});

server.listen(3000, () => {
    console.log('TallySystem app is running on *:3000');
});

// ATEM Integration
// Atem Device
myAtem.on('connectionStateChange', function(state) {
	console.log('state', state);
});

myAtem.on('productNameChange', function(name) {
	console.log('name', name);
});

myAtem.on('connectionLost', function(state) {
	console.log('lost', state);
});

myAtem.on('error', function(state) {
	console.error('error', state);
});

myAtem.on('programBus', function(source) {
    atemStatus.PROGRAM = source;
    sendStatus();
	console.log('program bus changed to', source);
});
myAtem.on('previewBus', function(source) {
    atemStatus.PREVIEW = source;
    sendStatus();
	console.log('program bus changed to', source);
});

myAtem.ip = process.env.ATEM_IP;
myAtem.connect();

function sendStatus(){
    io.emit("cameraUpdate", atemStatus);
}

setTimeout(function(){
    atemStatus.PROGRAM = 1;
    sendStatus();
}, 20000)