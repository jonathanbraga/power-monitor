$(document).ready(function(){
  var socket = io.connect("http://localhost:8000");
  var ready = false;
  var _sqlAdd;
  var _sqlAddStatus;
  var moreone = 0;
  var _selectedComodoID;
  var _selectedDispositivoID;
  var _selectedDispositivoEstado;
  var statusDispositivoHistorico = new StatusDispositivoHistorico();


  socket.on("get-dispositivo-historico",function(dispositivos){
    for(i = 0; i< dispositivos.length; i++){
      var d1 = null;
      var d2 = null;
      if(dispositivos[i] != undefined)
      {
        d1 = new Date(dispositivos[i].data);
      }
      if(dispositivos[++i] != undefined)
      {
        d2 = new Date(dispositivos[i].data);
      }
      if(d1 != null || d2 != null)
      {
        CalculaHorasEntreDatas(d1,d2);
      }
    }
  });

  CalculaHorasEntreDatas = function(d1,d2){
    if(d1 != null && d2 != null)
    {
      var d1 = new Date(d1).getTime();
      var d2 = d2 || new Date().getTime();
      var df = Math.abs(d1 - d2);
      var td = {
          d: Math.round(df / (24 * 60 * 60 * 1000)), //dias
          h: Math.round(df / (60 * 60 * 1000)), //horas
          m: Math.abs(Math.round(df / (60 * 1000)) - (60 * 1000)), //minutos
          s: Math.abs(Math.round(df / 1000) - 1000)
      };
      var result = '';
      td.d > 0 ? result += td.d + ' dias ' : '';
      td.h > 0 ? result += ('0' + td.h).slice(-2) + ':' : '00:';
      td.m > 0 ? result += ('0' + td.m).slice(-2) + ':' : '00:';
      td.s > 0 ? result += ('0' + td.s).slice(-2) : '00';

      console.log(result);
    }
  }
  //Recebe o Comodo selecionado
  socket.on("get-selected-comodo", function(c){
    _selectedComodoID = c[0].id;
   jQuery("label[for='titleComodo']").html(c[0].nome);
  });

  //Recebe todos os dispositivos do comodo selecionado
  socket.on("get-dispositivos-selected-comodo",function(d){
    var icone;
    var status = "";
    var status_color = "";
    for(i=0; i<d.length;i++)
    {
      if(d[i].estado == 0){
        status = "off";
        status_color = "red";
      }
      else{
        var status = "on";
        var status_color = "green";
      }
      icone = "fa fa-cutlery";
      $("#box-dispositivos").append('<button class="btn btn-app" type="button" onclick="selectedDispositivo(this,'+d[i].id+','+d[i].estado+','+d[i].quantidade_dispositivo+')"><span class="badge bg-'+status_color+'">'+status+'</span>'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
    }
    console.log(d);
  });

  //Adiciona os dispositivos a ao select
  socket.on("get-dispositivos",function(d){
    for(i=0; i<d.length;i++)
    {
      $('#select-dispositivo').append($('<option>', { 
        value: d[i].id,
        text : d[i].nome 
      }));
    }
    console.log(d);
  });

  //Lista dos dispositivos adicionados ao comodo
  $("#adicionar-dispositivo").click(function(){
    moreone = moreone + 1;
    var data = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var quantidade =  $("#inputQuantidade").val();
    var dispositivo =  $( "#select-dispositivo option:selected" ).text();
    var dispositivo_id = $( "#select-dispositivo option:selected" ).val();
    $('#tabela-dispositivos tr:last').after('<tr><td>'+dispositivo+'</td><td>'+quantidade+'</td><td><button type="button" class="btn btn-block btn-danger btn-xs" onclick="remove(this)">Excluir</button></td>');
    if(moreone > 1){
      _sqlAdd = _sqlAdd + ",("+quantidade+", "+_selectedComodoID+", "+dispositivo_id+")"
      _sqlAddStatus = _sqlAddStatus + ",(0,"+dispositivo_id+","+_selectedComodoID+")";
    }
    else{
      _sqlAdd = "("+quantidade+", "+_selectedComodoID+", "+dispositivo_id+")"
      _sqlAddStatus = "(0,"+dispositivo_id+","+_selectedComodoID+")";
    }
    $("#inputQuantidade").val("");
  });

  //Adiciona dispostivo ao comodo selecionado
  $("#addDispositivoComodo").click(function(){
    var sqlAdd = "INSERT INTO comodo_dispositivo (quantidade_dispositivo,id_comodo,id_dispositivo) values "+_sqlAdd+" ;";
    socket.emit("general-sql", sqlAdd);

    var sqlAddStatus = "INSERT INTO status_dispositivo (estado,id_dispositivo,id_comodo) values "+_sqlAddStatus+" ;";
    socket.emit("general-sql", sqlAddStatus);

    location.reload();
  });

  //Ligar ou Desligar Dispostivo

  $("#onDispositivo").click(function(){
    if(_selectedDispositivoEstado == 1)
    {
      alert("O dispositivo já se encontra ligado");
      return false;
    }
    //Atualiza o valor em status_dispositivo
    var sql_update_on = "UPDATE status_dispositivo SET estado = 1 WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";"
    socket.emit("general-sql", sql_update_on);
    //adiciona o valor em status_dispositivo_historico
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var sql_create_on = "INSERT INTO status_dispositivo_historico (estado,data,id_dispositivo,id_comodo) VALUES (1,'"+date+"',"+_selectedDispositivoID+", "+_selectedComodoID+")"
    socket.emit("status-dispositivo",sql_create_on,1);  
    location.reload();
  });

  $("#offDispositivo").click(function(){
    if(_selectedDispositivoEstado == 0)
    {
      alert("O dispositivo já se encontra desligado");
      return false;
    }
    //Atualiza o valor em status dispositivo
    var sql_update_off = "UPDATE status_dispositivo SET estado = 0 WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";"
    socket.emit("general-sql", sql_update_off);
    //adiciona o valor em status_dispositivo_historico
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var sql_create_off = "INSERT INTO status_dispositivo_historico (estado,data,id_dispositivo,id_comodo) VALUES (0,'"+date+"',"+_selectedDispositivoID+","+_selectedComodoID+")"
    socket.emit("status-dispositivo",sql_create_off,0);
    location.reload();
  });

  //Deleta dispositivo do comodo selecionado
  $("#deleteDispositivo").click(function(){
   
    //historico 
    var sql_historico = "DELETE FROM status_dispositivo_historico WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";";
    socket.emit("general-sql",sql_historico);
    //status_dispositivo
    var sql_status = "DELETE FROM status_dispositivo WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";";
    socket.emit("general-sql",sql_status);
    //comodo dispositivo 
    var sql_cd = "DELETE FROM comodo_dispositivo WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";";
    socket.emit("general-sql",sql_cd);

    location.reload();
  });

  // General Function
  (function($) {
    remove = function(item,comodoItem) {
      var tr = $(item).closest('tr');		
      tr.fadeOut(300, function() {
        tr.remove();
      });
      $("#inputQuantidade").val("");
    return false;		  
    }

    selectedDispositivo= function(item,id,estado,quantidade){
      //Atualiza o valor da tablea SELECT dispositivo
      var sql_update_dispositivo_selecionado = "UPDATE select_dispositivo SET dispositivo_id = "+id+", comodo_id = "+_selectedComodoID+";";
      socket.emit("general-sql", sql_update_dispositivo_selecionado);

      _selectedDispositivoID = id;
      _selectedDispositivoEstado = estado;
      $("#modal-dispositivo").modal('show');
      return false;
    }
  })(jQuery);
});


