var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var clients = {};

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"789123",
    database: "db"
});

app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  

    // Get dispositivos    
    con.query("SELECT * FROM dispositivo ORDER BY nome", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-dispositivos",result)
    });

    ///List Comodos****
    //var sql_list_comodos = "select comodo.nome, comodo.quantidade as comodo, dispositivo.nome as dispositivo from comodo join dispositivo on comodo.id_dispositivo = dispositivo.id ORDER BY comodo.nome";
    con.query("SELECT DISTINCT* FROM comodo ORDER BY nome", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-comodos",result)
    });

    //Qualquer SQL
    client.on("general-sql", function(sql){
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });        
    });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
