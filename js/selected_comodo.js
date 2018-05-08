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

  // socket.on("get-dispositivo",function(dispositivo){
  //   _dispositivo.id = dispositivo[0].id;
  //   _dispositivo.nome = dispositivo[0].nome;
  //   _dispositivo.gasto = dispositivo[0].gasto;
  //   _dispositivo.dataCriacual = mesAtual.getMonth();
  //     if(dispositivos[i] != undefined)
  //     {
  //       d1 = new Date(dispositivos[i].data);
  //     }
  //     if(dispositivos[++i] != undefined)
  //     {
  //       d2 = new Date(dispositivos[i].data);
  //     }
  //     if(d1 != null || d2 != null)
  //     {
  //       if(d2 != null && d2.getMonth() == mesAtual)
  //       {          
  //         var resultadoHoras = CalculaHorasEntreDatas(d1,d2);
  //       }
  //     }
  //   }
  // });

  // CalculaHorasEntreDatas = function(d1,d2){
  //   if(d1 != null && d2 != null)
  //   {
  //     var result = Math.abs(d2- d1) / 36e5;
  //     var consumoTotal = (_dispositivo.gasto * result)/720;
  //     consumoTotal = consumoTotal * 0.35;
  //     consoao = new Date(dispositivo[0].data_criacao);
  // });


  // socket.on("get-dispositivo-historico",function(dispositivos){
  //   for(i = 0; i< dispositivos.length; i++){
  //     var d1 = null;
  //     var d2 = null;
  //     var mesAtual = new Date();
  //     mesAtle.log(consumoTotal)
  //   }
  // }


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
          if(prox != undefined && teste != item[0].id && prox.id != item[0].id && prox.idDispositivo == item[0].idDispositivo){
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
    Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Consumo dos dispositivos no mês atual'
      },
      yAxis: {
          min: 0.00,
          title: {
              text: 'Consumo em reais'
          }
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: _chartData
    });

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


