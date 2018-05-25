$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");

    //Receb todas as notificações
    socket.on("get-notifications",function(item){
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

    //Listagem de Alarmes
    socket.on("getAlarmes",function(c){    
        for(i=0; i<c.length;i++){
            $('#listagem-comodo tr:last').after('<tr><td style="width:8%;"><button type="button" class="btn btn-block btn-danger btn-xs" onclick="remove(this,'+c[i].alarme_id+')">Excluir</button></td><td>'+c[i].nome+'</td><td>R$ '+c[i].limite+'</td>');      
        }
    });

    //Exclui um alarme
    (function($) {
        remove = function(item,alarmeID) {
          var tr = $(item).closest('tr');		
          tr.fadeOut(400, function() {
            tr.remove();  		    
          });
        var sql = "DELETE FROM alarme where id = "+alarmeID+"";
        socket.emit("general-sql",sql);  
        return false;		  
        }		
      })(jQuery);
});