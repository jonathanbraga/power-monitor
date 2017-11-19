var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var clients = {};

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"789123",
    database: "teste"
});

app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  

    // Get dispositivos
    con.query("SELECT * FROM dispositivo", function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        io.emit("get-dispositivos",result)
    });

    //Creat Comodo
    client.on("add-comodo", function(name){
        console.log("Comodo: " + name);
        con.query("SELECT * FROM comodo", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });        
    });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});