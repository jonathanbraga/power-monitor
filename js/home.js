$(document).ready(function(){
  var socket = io.connect("http://localhost:8000");
  var ready = false;
  var _sqlAdd;
  var moreone = 0;
  var _selectedComodoID;
  var dispositivos_ligados_lista = new Array();
  var statusDispositivo = new StatusDispositivo();
  var _notifications = new Notification();
  var _idNotificacao = new Array();
  var _statusDispositivoHistorico = new StatusDispositivoHistorico();
  var _listaStatusDispositivoHistorico = [];
  var _comodos = [];
  var _chartData = new Array();

    //Receb todas as notificações
    socket.on("get-notifications",function(item){
      console.log(item);
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
      console.log(_idNotificacao.length)
      if(_idNotificacao.length != 0){
        var sql_update_notification = "UPDATE notification set isRead = true IN ("+_idNotificacao+");";
        socket.emit("general-sql",sql_update_notification);      
      }
      $("#count").empty();
      $("#count").append("0");
    });

  socket.on("get-dispositivos-on",function(r){
    $.each(r,function(index,value){
      statusDispositivo.id = value.id;
      statusDispositivo.estado = value.estado;
      statusDispositivo.idComodo = value.id_comodo;
      statusDispositivo.idDispositivo = value.id_dispositivo;
      dispositivos_ligados_lista.push(statusDispositivo);
      statusDispositivo = new StatusDispositivo();
    });
  });
  
  //Recebe todos os dispositivos
  socket.on("get-comodos",function(d){
    var st_on = 0;
    $.each(d,function(indexComodo,comodo){
      _comodos.push({id:comodo.id,nome:comodo.nome})
      var icone;
      if(comodo.nome.toLowerCase() == "cozinha" ){
        icone = "fa fa-cutlery";
      }
      else if(comodo.nome.toLowerCase() == "jardim" ){
        icone = "fa fa-leaf";
      }
      else if(comodo.nome.toLowerCase() == "lavanderia" ){
        icone = "fa fa-pied-piper";
      }
      else if(comodo.nome.toLowerCase().indexOf("banheiro") != -1){
        icone = "fa fa-tint";
      }
      else if(comodo.nome.toLowerCase().indexOf("sala") != -1){
        icone = "fa fa-coffee";
      }
      else if(comodo.nome.toLowerCase().indexOf("quarto") != -1|| comodo.nome.toLowerCase().indexOf("suite") != -1){
        icone = "fa fa-bed";
      }
      else{
        icone = "";
      }
      $.each(dispositivos_ligados_lista,function(indexDispositivo,dispositivo){
        if(comodo.id == dispositivo.idComodo && dispositivo.estado == 1){
          st_on = st_on + 1;
        }
      })
      $("#box-comodos").append('<button class="btn btn-app" type="button" onclick="comodo(this,'+comodo.id+')"><span class="badge bg-blue">'+st_on+'</span><i class="'+icone+'"></i>'+comodo.nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
      st_on = 0;
    })
  });

  socket.on("getStatusDispositivoComodoByMonth",function(result){
    $.each(result,function(index,item){
      _statusDispositivoHistorico.id = item.id;
      _statusDispositivoHistorico.idComodo = item.id_comodo;
      _statusDispositivoHistorico.idDispositivo = item.id_dispositivo
      _statusDispositivoHistorico.data = item.data;
      _statusDispositivoHistorico.estado = item.estado;
      _statusDispositivoHistorico.gasto = item.gasto

      _listaStatusDispositivoHistorico.push(_statusDispositivoHistorico);
      _statusDispositivoHistorico = new StatusDispositivoHistorico();
    });
    
    var auxIndex = 0;
    var teste = 0;
    var valor = 0;
    $.each(_comodos,function(indexComodo,comodo){
      auxIndex = 0;
      valor = 0;
      console.log(comodo.nome)
      $.each(_listaStatusDispositivoHistorico,function(){
        //Elemento Atual
        var item = $(this).data('item',auxIndex);
        //Proximo indece e item
        var t = auxIndex +1;
        var prox = [];

        //Verifica se o indice do prox elemento é menor ou igual que a lista atual
        if(t <= _listaStatusDispositivoHistorico.length){
          prox = _listaStatusDispositivoHistorico[t];
        }
        
        if(comodo.id == item[0].idComodo && prox != undefined ){
          if(item[0].idDispositivo != prox.idDispositivo){
            console.log(item[0].id, prox.id)
          }
          //Verifica se o dispositivo é válido
          if(teste != item[0].id && prox.id != item[0].id && 
            prox.idDispositivo == item[0].idDispositivo && item[0].estado != prox.estado){
            teste = prox.id;
            console.log("item atual: ", item[0].id,item[0].estado, item[0].gasto)
            console.log("Proximo item: ", prox.id,prox.estado, prox.gasto)
            var d1 = new Date(item[0].data)
            var d2 = new Date(prox.data)
            var calcDatas = CalculaHorasEntreDatas(d1, d2);
            var result = CalculaConsumoDispositivo(calcDatas,item[0].gasto);
            valor = valor + result;
          }
        }
        auxIndex ++;
      });
      _chartData.push({name:comodo.nome,data:[valor]});
    });
    Horizontal_Chart(_chartData,'Gráfico mensal por cômodo');
  }); 

  // -------------------------------------------------- COMODO SELECIONADO ----------------------------------------------------  
 

  // General Function
  (function($) {
    comodo = function(item,comodoItemID) {
      var sql;
      var comodo;
      socket.on("get-selected-comodo", function(c){
        comodo = c[0];
      });
      console.log(comodo);
      var sql = "UPDATE selected_comodo set comodo_id = "+comodoItemID+"";        
      console.log("SQL", sql)
      socket.emit("general-sql",sql);
      window.location.replace("/comodo_selected"); 
       
    return false;		  
    }
  })(jQuery);
});


