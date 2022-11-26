let connections = []

const socketController = ( request ) => {
      
    var connection = request.accept(null, request.origin)
    connections.push(connection);

    console.log('Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data); this resend the reseived message, instead of it i will send a custom message. hello from nodejs
            //connection.sendUTF("Hello from node.js");
            
            connections.forEach(function(destination) {
                destination.sendUTF(message.utf8Data);
            });
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });



    connection.on('close', function(reasonCode, description) {
        console.log(connection.remoteAddress + ' disconnected.');
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
    });
}

module.exports = {
    socketController,
}