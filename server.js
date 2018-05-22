var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var static = require('express-static');
var router = require('express').Router();
var mysql = require('mysql');
var moment = require('moment');

var currentMonth = moment(new Date(),'YYYY/MM/DD').format('M');

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
//rota configurações
router.get("/settings", function (req, res) {
    res.sendFile(__dirname + "/settings.html");
});


app.use("/", router);

//Main connection
io.on('connection', function (client) {

    // Get todas as notificações
    con.query("SELECT * FROM notification WHERE isRead = false ORDER BY created DESC;",function(err,result,fields){
        if(err) throw err;
        io.emit("get-notifications",result);
    });
    
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
    con.query("SELECT DISTINCT* FROM comodo ORDER BY nome;", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-comodos", result)
    });
    
    // Get Historico de dispositivos pelo mês atual
    con.query("SELECT sdh.id as id, sdh.data as data, sdh.estado as estado, sdh.id_comodo as id_comodo, sdh.id_dispositivo as id_dispositivo, d.gasto as gasto FROM status_dispositivo_historico sdh, dispositivo d  WHERE MONTH(sdh.data) = "+currentMonth+" and d.id = sdh.id_dispositivo ORDER BY sdh.id_dispositivo,sdh.id_comodo,sdh.data;", function(err,result,fields){
        if(err) throw err;
        io.emit("getStatusDispositivoComodoByMonth",result);
    });

    //Get Comodo selecionado
    con.query("SELECT c.id,c.nome from comodo c, selected_comodo sc where c.id = sc.comodo_id", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-selected-comodo", result);
    });
    
    //Get dispositivos do comodo selecionado    
    con.query("SELECT DISTINCT d.id,d.nome, d.gasto, sd.estado, cd.quantidade_dispositivo  FROM dispositivo d, status_dispositivo sd, comodo_dispositivo cd, selected_comodo sc WHERE sc.comodo_id = cd.id_comodo and d.id = cd.id_dispositivo and d.id = sd.id_dispositivo and sd.id_comodo = sc.comodo_id;", function (err, result, fields) {
        if (err) throw err;
        io.emit("get-dispositivos-selected-comodo", result);
        //console.log(result);
    });

    // Get Status dos dispositvos por comodo selecionado
    con.query("SELECT sdh.id,sdh.estado,sdh.data,sdh.id_dispositivo,sdh.id_comodo FROM status_dispositivo_historico sdh, selected_comodo sc WHERE sdh.id_comodo = sc.comodo_id AND MONTH(sdh.data) = "+currentMonth+" ORDER BY sdh.id_dispositivo,sdh.data;", function(err,result,fields){
        if(err) throw err;
        io.emit("get-status-dispositivos-comodo",result);
    });

    //Recebe todos os comodos que não possuem alarmes
    con.query("SELECT c.nome,c.id FROM comodo c, alarme al WHERE c.id != al.comodo_id ORDER BY c.nome;", function(err,result,fields){
        if(err) throw err;
        io.emit("getComodosSemAlarme",result);
    });

    //Qualquer SQL
    client.on("general-sql", function (sql) {
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
    });
    
    con.query("SELECT d.id, d.nome, d.gasto, d.data_criacao FROM dispositivo d, select_dispositivo sd WHERE d.id = sd.dispositivo_id;",function(err,result,fields){
        if(err) throw err;
        io.emit("get-dispositivo", result);
    });

    con.query("SELECT sdh.id, sdh.estado, sdh.data, sdh.id_dispositivo, sdh.id_comodo FROM status_dispositivo_historico sdh, select_dispositivo sd WHERE sdh.id_dispositivo = sd.dispositivo_id and sdh.id_comodo = sd.comodo_id;",function(err,result,fields){
        if(err) throw err;
        io.emit("get-dispositivo-historico", result);
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
