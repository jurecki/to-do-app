const express = require('express')
const app = express()
const port = 8000
const socket = require('socket.io');
const tasks = []
const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.use((req, res) => {
    res.status(404).send({ message: "Not found" })
})

const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', (tasks));

    socket.on('addTask', (taskName) => {
        console.log('Oh, I\'ve added task  ' + taskName);
        tasks.push(taskName);
        socket.broadcast.emit('addTask', taskName)
    })

    socket.on('removeTask', (id) => {
        console.log('Oh, I\'ve remove task  ' + id);
        tasks.splice(id, 1)
        socket.broadcast.emit('removeTask', (id))
    })


});