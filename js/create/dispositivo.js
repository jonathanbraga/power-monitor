$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;

//Create dispositivo
  $("#form-dispositivo").submit(function(e){
    var nome = $("#inputNome").val();
    var gasto = $("#inputGasto").val();
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var sql = "INSERT INTO dispositivo (nome,gasto,data_criacao) values ('"+nome+"',"+gasto+",'"+date+"');";
    socket.emit("general-sql", sql);
  });

  //List Dispositivos
  socket.on("get-dispositivos",function(c){    
    for(i=0; i<c.length;i++)
    {
      $('#listagem-dispositivos tr:last').after('<tr><td style="width:8%;"><button type="button" class="btn btn-block btn-danger btn-xs" onclick="remove(this,'+c[i].id+')">Excluir</button></td><td>'+c[i].nome+'</td><td>'+c[i].gasto+' kw/h</td>><td>'+c[i].data_criacao+'</td>');      
    }
    console.log(c);
  });
  (function($) {
    remove = function(item,dispositivoItem) {
      var tr = $(item).closest('tr');		
      tr.fadeOut(400, function() {
                  tr.remove();  		    
      });
    var sql = "DELETE FROM dispositivo where id = "+dispositivoItem+"";
    socket.emit("general-sql",sql);  
    return false;		  
    }		
  })(jQuery);

});

