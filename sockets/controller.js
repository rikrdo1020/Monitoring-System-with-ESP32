const { Socket } = require("socket.io")

const socketController = async( socket = new Socket(), io ) => {

    //console.log(socket)

    socket.on('disconnect', () => {
        //console.log('Disconnected')
    })

    socket.on('message', () => {
        
    })

}

module.exports = {
    socketController
}