var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

//Local variables
var _selectedComodo;

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

    ///Get Comodos    
    con.query("SELECT DISTINCT* FROM comodo ORDER BY nome", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-comodos",result)
    });

    //Get Comodo selecionado
    con.query("SELECT c.id,c.nome from comodo c, selected_comodo sc where c.id = sc.comodo_id", function (err, result, fields){
        if(err) throw err;
        io.emit("get-selected-comodo",result);
    });

    //Get dispositivos do comodo selecionado    
    con.query("SELECT DISTINCT d.id,d.nome,sd.estado, cd.quantidade_dispositivo  FROM dispositivo d, status_dispositivo sd, comodo_dispositivo cd, selected_comodo sc WHERE sc.comodo_id = cd.id_comodo and d.id = cd.id_dispositivo and d.id = sd.id_dispositivo and sd.id_comodo = sc.comodo_id;", function (err, result, fields){
        if(err) throw err;
        io.emit("get-dispositivos-selected-comodo",result);
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
