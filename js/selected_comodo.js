$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;
  var _sqlAdd;
  var _sqlAddStatus;
  var moreone = 0;
  var _selectedComodoID;
  var _selectedDispositivoID;
  var _selectedDispositivoEstado;

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
      _sqlAddStatus = _sqlAddStatus + ",(0,"+dispositivo_id+")";
    }
    else{
      _sqlAdd = "("+quantidade+", "+_selectedComodoID+", "+dispositivo_id+")"
      _sqlAddStatus = "(0,"+dispositivo_id+")";
    }
    $("#inputQuantidade").val("");
  });

  //Adiciona dispostivo ao comodo
  $("#addDispositivoComodo").click(function(){
    var sqlAdd = "INSERT INTO comodo_dispositivo (quantidade_dispositivo,id_comodo,id_dispositivo) values "+_sqlAdd+" ;";
    socket.emit("general-sql", sqlAdd);

    var sqlAddStatus = "INSERT INTO status_dispositivo (estado,id_dispositivo) values "+_sqlAddStatus+" ;";
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
    var sql_update_on = "UPDATE status_dispositivo SET estado = 1 WHERE id_dispositivo = "+_selectedDispositivoID+";"
    socket.emit("general-sql", sql_update_on);
    //adiciona o valor em status_dispositivo_historico
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var sql_create_on = "INSERT INTO status_dispositivo_historico (estado,data,id_dispositivo,id_comodo) VALUES (1,'"+date+"',"+_selectedDispositivoID+", "+_selectedComodoID+")"
    socket.emit("general-sql",sql_create_on);
    location.reload();
  });

  $("#offDispositivo").click(function(){
    if(_selectedDispositivoEstado == 0)
    {
      alert("O dispositivo já se encontra desligado");
      return false;
    }
    //Atualiza o valor em status dispositivo
    var sql_update_off = "UPDATE status_dispositivo SET estado = 0 WHERE id_dispositivo = "+_selectedDispositivoID+";"
    socket.emit("general-sql", sql_update_off);
    //adiciona o valor em status_dispositivo_historico
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
    var sql_create_off = "INSERT INTO status_dispositivo_historico (estado,data,id_dispositivo,id_comodo) VALUES (0,'"+date+"',"+_selectedDispositivoID+","+_selectedComodoID+")"
    socket.emit("general-sql",sql_create_off);
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
      _selectedDispositivoID = id;
      _selectedDispositivoEstado = estado;
      $("#modal-dispositivo").modal('show');
      return false;
    }
  })(jQuery);
});


