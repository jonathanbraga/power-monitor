var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var static = require('express-static');
var router = require('express').Router();
var mysql = require('mysql');

//Load nos arquivos static
server.listen(process.env.PORT || 8000);
app.use("/bower_components", static(__dirname + '/bower_components'));
app.use("/dist", static(__dirname + '/dist'));
app.use("/node_modules", static(__dirname + '/node_modules'));
app.use("/js", static(__dirname + '/js'));

//Local variables
var _selectedComodo;
var clients = {};
var led = { state: false };
var msg = "";

//DB Connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "789123",
    database: "db"
});

// ROTAS
//Principal
router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});
//rota index
router.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
//rotas comodo
router.get("/create_comodo", function (req, res) {
    res.sendFile(__dirname + "/create_comodo.html");
});
router.get("/list_comodo", function (req, res) {
    res.sendFile(__dirname + "/list_comodo.html");
});
// rotas dispositivo
router.get("/create_dispositivo", function (req, res) {
    res.sendFile(__dirname + "/create_dispositivo.html");
});
router.get("/list_dispositivo", function (req, res) {
    res.sendFile(__dirname + "/list_dispositivo.html");
});
//rota comodo selecionado
router.get("/comodo_selected", function (req, res) {
    res.sendFile(__dirname + "/comodo_selected.html");
});


app.use("/", router);

//Main connection
io.on('connection', function (client) {

    // Get dispositivos    
    con.query("SELECT DISTINCT * FROM dispositivo ORDER BY nome", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-dispositivos", result)
    });
    
    //Get Dispositivos ligados
    con.query("SELECT id,estado,id_dispositivo,id_comodo FROM status_dispositivo WHERE estado = 1", function (err, result, fields){
        if(err) throw err;
        io.emit("get-dispositivos-on",result);
    });
    ///Get Comodos    
    con.query("SELECT c.id, c.nome, SUM(cd.estado)  FROM comodo c, status_dispositivo cd WHERE cd.estado = 1 GROUP BY c.id;", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-comodos", result)
    });

    //Get Comodo selecionado
    con.query("SELECT c.id,c.nome from comodo c, selected_comodo sc where c.id = sc.comodo_id", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-selected-comodo", result);
    });

    //Get dispositivos do comodo selecionado    
    con.query("SELECT DISTINCT d.id,d.nome,sd.estado, cd.quantidade_dispositivo  FROM dispositivo d, status_dispositivo sd, comodo_dispositivo cd, selected_comodo sc WHERE sc.comodo_id = cd.id_comodo and d.id = cd.id_dispositivo and d.id = sd.id_dispositivo and sd.id_comodo = sc.comodo_id;", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-dispositivos-selected-comodo", result);
        //console.log(result);
    });

    //Qualquer SQL
    client.on("general-sql", function (sql) {
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
    });


    client.on("status-dispositivo", function (sql, stateLed) {
        con.query(sql, stateLed, function (err, result, fields) {
            if (err) throw err;

            console.log(stateLed)
            if (stateLed == 1) {
                led.state = true
                console.log('id: ' + stateLed + ' led: ' + led.state);
                io.emit('led', led);
            }
            else if (stateLed == 0) {
                led.state = false;
                console.log('id: ' + stateLed + ' led: ' + led.state);
                io.emit('led', led);
            }
        });
    });

});
