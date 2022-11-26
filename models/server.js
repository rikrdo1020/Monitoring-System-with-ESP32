const express = require('express')
const cors = require('cors');
const { createServer } = require('http')
//const WebSocketServer = require('websocket').server;

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');


class Server{

    constructor(){
        this.app  = express()
        this.port = process.env.PORT;
        this.server = createServer( this.app )
        this.io     = require('socket.io')(this.server)
        // this.ws = new WebSocketServer({
        //     httpServer: this.server,
        //     autoAcceptConnections: false,
        //     keepalive: true
        // });

        this.paths = {
            auth:   '/api/auth',
            users:   '/api/users',
        }   
        // Connectar a base de datos
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

        //Sockets
        this.sockets()
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );


        //Directorio publico
        this.app.use( express.static('public') )
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.post('/api/values', (req, res) => {

            //console.log(req.body);
            this.io.sockets.emit('message', req.body)
            res.status(200).send('OK');
        })
    }

    sockets(){
        //this.ws.on("request", socketController)
        this.io.on("connection", (socket) => socketController( socket, this.io ))
    }

    listen(){
        this.server.listen(this.port, () =>{
            console.log('Server running on', this.port )
        })
    }
}

module.exports = Server;