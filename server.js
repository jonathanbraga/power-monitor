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
        io.emit("get-dispositivos",result)
    });

    // List Comodos
    var sql_list_comodos = "select comodo.nome, comodo.quantidade as comodo, dispositivo.nome as dispositivo from comodo join dispositivo on comodo.id_dispositivo = dispositivo.id ORDER BY comodo.nome";
    con.query(sql_list_comodos, function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        io.emit("list-comodos",result)
    });

    //Creat Comodo
    client.on("add-comodo", function(sql){
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });        
    });

    //Create Dispositivo
    client.on("add-dispositivo", function(sql){
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });        
    });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});