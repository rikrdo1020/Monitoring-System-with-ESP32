io = require('socket.io')(http);
const values = (req, res) => {

    console.log(req.body);
    res.status(200).send('OK');
}

module.exports = {
    values
}