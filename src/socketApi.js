const socketio = require('socket.io');
const io = socketio();

const socketApi = {};

socketApi.io = io;

const users = {};

io.on('connection', (socket) => {
    console.log('User connected!');

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        };
        users[socket.id] = Object.assign(data, defaultData);
        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayer', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });

    socket.on('animateLive', (data) => {
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        socket.broadcast.emit('animated', { socketId: socket.id, x: data.x, y: data.y });
    });
});

module.exports = socketApi;