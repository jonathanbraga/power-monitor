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
  var _dispositivo = new Dispositivo();
  var _statusDispositivoHistorico = new StatusDispositivoHistorico();
  var _listaStatusHistoricoDispositivos = new Array();
  var _listaComodoDispositivo = new Array();
  var _chartData = new Array();
  var _nomeComodo = "";
  var _nomeDispositivo = "";
  var _listaDispositivos = new Array();
  var _idNotificacao = new Array();
  
  //Receb todas as notificações
  socket.on("get-notifications",function(item){
    //Listagem dos paineis de aviso
    var limiteComodos = $.parseJSON($.cookie("LimiteComodos"));
    $.each(limiteComodos,function(index,item){

      if(item.porcentagemGasto > 50 && item.porcentagemGasto <= 79){
        $("#aviso-painel").append(PanelWarning(item.porcentagemGasto,item.nomeComodo));
        cor = "yellow"
      }

      else if(item.porcentagemGasto >= 80){
        $("#aviso-painel").append(PanelDanger(item.porcentagemGasto,item.nomeComodo));
        cor = "red"
      }
    });

    //Número em desta das mensagens
    $("#count-message").append('<span class="label label-warning"><label id="count">'+item.length+'</label></span>')
    //informação complementar ao abrir o quadro de notificações
    $("#info-count-message").append('Você tem '+item.length+' mensagens não lidas')
    // listagem das notificações
    $.each(item,function(index,item){
      $("#lista-notificacao").append('<ul class="menu"> <li> <a href="#"> <i class="fa fa-users text-aqua"></i> '+item.message+' </a></li></ul>')
      _idNotificacao.push(item.id);
    });
  });

  // Lista de notificação
  $("#notifications").click(function(){
    if(_idNotificacao.length != 0){
      var sql_update_notification = "UPDATE notification set isRead = true IN ("+_idNotificacao+");";
      socket.emit("general-sql",sql_update_notification);      
    }
    $("#count").empty();
    $("#count").append("0");
  });

  //Recebe o Comodo selecionado
  socket.on("get-selected-comodo", function(c){
    _selectedComodoID = c[0].id;
    _nomeComodo = c[0].nome;
   jQuery("label[for='titleComodo']").html(c[0].nome);
  });

  //Recebe todos os dispositivos do comodo selecionado
  socket.on("get-dispositivos-selected-comodo",function(d){
    var icone;
    var status = "";
    var status_color = "";
    for(i=0; i<d.length;i++)
    {
      // Cria o objeto _dispositivo
      _dispositivo.id = d[i].id;
      _dispositivo.nome = d[i].nome;
      _dispositivo.gasto = d[i].gasto;

      //preenche a lista de dispositivos do comodo
      _listaComodoDispositivo.push(_dispositivo);
      _dispositivo = new Dispositivo();

      if(d[i].estado == 0){
        status = "off";
        status_color = "red";
      }
      else{
        var status = "on";
        var status_color = "green";
      }

      _listaDispositivos.push({nome: d[i].nome, id: d[i].id});
      icone = "fa fa-cutlery";
      $("#box-dispositivos").append('<button class="btn btn-app" type="button" onclick="selectedDispositivo(this,'+d[i].id+','+d[i].estado+','+d[i].quantidade_dispositivo+')"><span class="badge bg-'+status_color+'">'+status+'</span>'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
    }
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
  });

  //Dados para o gŕafico
  socket.on("get-status-dispositivos-comodo",function(result){
    $.each(result, function(index,value){
      _statusDispositivoHistorico.id = value.id;
      _statusDispositivoHistorico.estado = value.estado;
      _statusDispositivoHistorico.data = new Date(value.data);
      _statusDispositivoHistorico.idDispositivo = value.id_dispositivo;
      _statusDispositivoHistorico.idComodo = value.id_comodo;
      _listaStatusHistoricoDispositivos.push(_statusDispositivoHistorico);      
      _statusDispositivoHistorico = new StatusDispositivoHistorico();
    });

    var auxIndex = 0;
    var teste = 0;
    var valor = 0;
    $.each(_listaComodoDispositivo,function(indexDispositivo,dispositivo){      
      auxIndex = 0;
      valor = 0;
      $.each(_listaStatusHistoricoDispositivos, function(){
        //Elemento Atual
        var item = $(this).data('item',auxIndex);
        //Indice do prox elemento
        var t = auxIndex + 1;
        var prox = [];
        //Verifica se o indice do prox elemento é menor ou igual que a lista atual
        if(t <= _listaStatusHistoricoDispositivos.length){
          prox = _listaStatusHistoricoDispositivos[t];
        }
        //Verifica se é o mesmo dispositivo
        if(dispositivo.id == item[0].idDispositivo){
          //Verifica se o dispositivo é válido
          if(prox != undefined && teste != item[0].id && prox.id != item[0].id && prox.idDispositivo == item[0].idDispositivo && item[0].estado != prox.estado){
            teste = prox.id;
            var calcDatas = CalculaHorasEntreDatas(item[0].data, prox.data);
            var result = CalculaConsumoDispositivo(calcDatas,dispositivo.gasto);
            valor = valor + result;
          }
        }
        auxIndex ++;
      });
      _chartData.push({name:dispositivo.nome,data:[valor]});
    });

    // Gráfico do consumo de cada dispositivo
    Vertical_Chart(_chartData,'Consumo dos dispositivos no mês atual');

  });

  //adiciona a lista dos dispositivos do comodo
  $("#adicionar-dispositivo").click(function(){
    if($("#inputQuantidade")[0].value != ""){
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
    }else{
      alert("Insira a quantidade")
    }
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
    //Formatando Data e Hora
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

    if(_selectedDispositivoEstado == 1)
    {
      alert("O dispositivo já se encontra ligado");
      return false;
    }
    //Adiciona a mensagem na table de notificação
    var message_notification = ""+_nomeDispositivo+" <strong>ON</strong> em "+_nomeComodo+"";
    var sql_notification = "INSERT INTO notification (message,isRead,created) VALUES ('"+message_notification+"',false,'"+date+"');";
    socket.emit("general-sql",sql_notification);

    //Atualiza o valor em status_dispositivo
    var sql_update_on = "UPDATE status_dispositivo SET estado = 1 WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";"
    socket.emit("general-sql", sql_update_on);

    //adiciona o valor em status_dispositivo_historico
    var sql_create_on = "INSERT INTO status_dispositivo_historico (estado,data,id_dispositivo,id_comodo) VALUES (1,'"+date+"',"+_selectedDispositivoID+", "+_selectedComodoID+")"
    socket.emit("general-sql",sql_create_on,1);  
    location.reload();
  });

  $("#offDispositivo").click(function(){
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

    if(_selectedDispositivoEstado == 0)
    {
      alert("O dispositivo já se encontra desligado");
      return false;
    }

    //Adiciona a mensagem na table de notificação
    var message_notification = ""+_nomeDispositivo+" <strong>OFF</strong> em "+_nomeComodo+"";
    var sql_notification = "INSERT INTO notification (message,isRead,created) VALUES ('"+message_notification+"',false,'"+date+"');";
    socket.emit("general-sql",sql_notification);

    //Atualiza o valor em status dispositivo
    var sql_update_off = "UPDATE status_dispositivo SET estado = 0 WHERE id_dispositivo = "+_selectedDispositivoID+" and id_comodo = "+_selectedComodoID+";"
    socket.emit("general-sql", sql_update_off);
    
    //adiciona o valor em status_dispositivo_historico
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

      // Lista para auxiliar no nome do dispositivo
      $.each(_listaDispositivos,function(index,item){
        if(item.id == id){
          _nomeDispositivo = item.nome
        }
      });
      
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


