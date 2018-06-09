var vrf_get_comodo = 0;
var vrf_get_dispositivos_on = 0;
var vrf_get_notifications = 0;
var vrf_notifications = 0;
var vrf_getStatusDispositivoComodoByMonth = 0;
var vrf_getConfiguracao = 0;
var vrf_getAlarmes = 0;

var globatalValorTotal = 0;

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
      vrf_get_notifications++;

      if(vrf_get_notifications > 1){
        return;
      }

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
      vrf_notifications ++;

      if(vrf_notifications > 1){
        return;
      }
      console.log(_idNotificacao.length)
      if(_idNotificacao.length != 0){
        var sql_update_notification = "UPDATE notification set isRead = true IN ("+_idNotificacao+");";
        socket.emit("general-sql",sql_update_notification);      
      }
      $("#count").empty();
      $("#count").append("0");
    });

  socket.on("get-dispositivos-on",function(r){
    vrf_get_dispositivos_on ++;

    if(vrf_get_dispositivos_on > 1){
      return;
    }

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
    vrf_get_comodo++;

    if(vrf_get_comodo > 1){
      console.log("entrei");
      return;
    }

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
    vrf_getStatusDispositivoComodoByMonth ++;

    if(vrf_getStatusDispositivoComodoByMonth > 1){
      return;
    }

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
          }
          //Verifica se o dispositivo é válido
          if(teste != item[0].id && prox.id != item[0].id && 
            prox.idDispositivo == item[0].idDispositivo && item[0].estado != prox.estado){
            teste = prox.id;
            var d1 = new Date(item[0].data)
            var d2 = new Date(prox.data)
            var calcDatas = CalculaHorasEntreDatas(d1, d2);
            var result = CalculaConsumoDispositivo(calcDatas,item[0].gasto);
            valor = valor + Number(result.toFixed(2));           
          }
        }
        auxIndex ++;
      });
      _chartData.push({id:comodo.id,name:comodo.nome,data:[valor],valorFormatado: valor.toFixed(2)});
    });

    $.each(_chartData, function(i,item){
      globatalValorTotal = globatalValorTotal + item.data[0];
    });

    $("#total-gasto").append('<div class="box-body"><div class="clearfix"><h4>R$ '+globatalValorTotal.toFixed(2)+'</h4></div></div>')
    
    Horizontal_Chart(_chartData,'Gráfico mensal por cômodo');
  });
  
  // Barra de progresso do consumo por cômodo
  socket.on("getConfiguracao",function(result){
    vrf_getConfiguracao ++;
    
    if(vrf_getConfiguracao > 1){
      return;
    }
    
    if(result.length > 0){
      if(result[0].gasto_mensal > 0){
        $.cookie("gastoMensal", JSON.stringify(result[0].gasto_mensal));
      }else{
        $.cookie("gastoMensal", null);
      }
    }
  });
  
  var saveDataLimite = new Array();
  socket.on("getAlarmes",function(alarmes){
    
    if(vrf_getStatusDispositivoComodoByMonth > 1){
      return;
    }
    
    $("#aviso-painel").empty();
    var gastoTotal =  $.parseJSON($.cookie("gastoMensal"));
    var painelHtml = '';
    var resultGastoTotal = ProgressoConsumo(gastoTotal,globatalValorTotal);


    var cor = "";
    if(resultGastoTotal < 20){
      cor="aqua";
    }
    else if(resultGastoTotal >= 20 && resultGastoTotal <= 50){
      cor = "green";
    }
    else if(resultGastoTotal >= 50 && resultGastoTotal <= 79){
      $("#aviso-painel").append(PanelWarning(resultGastoTotal.toFixed(2),''));
      cor = "yellow"
    }

    else if(resultGastoTotal >= 80){
      $("#aviso-painel").append(PanelDanger(resultGastoTotal,''));
      cor = "red"
    }

    //Prepara o HTML
    painelHtml = '<div class="box-body"><div class="clearfix"><span class="pull-left">Prvisão de gasto mensal - R$ '+gastoTotal+'</span><span class="pull-right">'+resultGastoTotal.toFixed(2)+'%</span></div><div class="progress"><div class="progress-bar progress-bar-'+cor+'" role="progressbar" aria-valuemax="100" style="width: '+resultGastoTotal.toFixed(2)+'%"></div></div></div>';
    $("#box-progress-total").append(painelHtml);
    $("#box-progress-total").append('<div class="box-body"><div class="clearfix"><span class="pull-left"> <b>Gastos em relação a espectativa mensal</b></span></div>');
    //Ordena o array pelo ID
    _chartData.sort(function(a,b){return a.id - b.id});
    //Ordena o array pelo ID
    alarmes.sort(function(a,b){return a.id - b.id});  
    // Salva dado em cash
    $.cookie("LimiteComodos",null)
    saveDataLimite.push({porcentagemGasto: resultGastoTotal.toFixed(2)});
    $.cookie("LimiteComodos", JSON.stringify(saveDataLimite));
    
    $.each(_chartData,function(inddexData,item){
      var result = ProgressoConsumo(gastoTotal,item.data);

      result = result.toFixed(2);
      $("#box-progress").append('<div class="box-body"><div class="clearfix"><span class="pull-left">'+item.name+' - '+item.valorFormatado+'</span><span class="pull-right">'+result+'%</span></div><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuemax="100" style="width: '+item.data+'%"></div></div></div>')        
    });
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


