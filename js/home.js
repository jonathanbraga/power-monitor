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
      $("#box-comodos").append('<button class="btn btn-app" type="button" onclick="comodo(this,'+comodo.id+')"><span class="badge bg-green">'+st_on+'</span><i class="'+icone+'"></i>'+comodo.nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
      st_on = 0;
    })
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


