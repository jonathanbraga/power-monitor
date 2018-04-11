$(document).ready(function(){
  var socket = io.connect("http://localhost:8000");
  var ready = false;
  var _sqlAdd;
  var moreone = 0;

  //Recebe todos os dispositivos
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

  //Cadastro de Comodo

  

  //Lista de Dispositivos adicionados
  $("#adicionar-dispositivo").click(function(){
    moreone = moreone + 1;
    var nome = $("#inputNome").val();
    var quantidade =  $("#inputQuantidade").val();
    var dispositivo =  $( "#select-dispositivo option:selected" ).text();
    var dispositivo_id =  $( "#select-dispositivo option:selected" ).val();
    $('#tabela-dispositivos tr:last').after('<tr><td>'+dispositivo+'</td><td>'+quantidade+'</td><td><button type="button" class="btn btn-block btn-danger btn-xs" onclick="remove(this)">Excluir</button></td>');
    if(moreone > 1){
      _sqlAdd = _sqlAdd + ",('"+nome+"',"+quantidade+", "+dispositivo_id+")"    
    }
    else{
      _sqlAdd = "('"+nome+"',"+quantidade+", "+dispositivo_id+")"    
    }    
  });

  //Cadastro - COMODO
  $("#form-comodo").submit(function(e){
    var nome = $("#inputNome").val();
    var sql = "INSERT INTO comodo (nome) values ('"+nome+"');";
    socket.emit("general-sql", sql);		
  });

  //List - Comodo
  socket.on("get-comodos",function(c){    
    for(i=0; i<c.length;i++)
    {
      $('#listagem-comodo tr:last').after('<tr><td style="width:8%;"><button type="button" class="btn btn-block btn-danger btn-xs" onclick="remove(this,'+c[i].id+')">Excluir</button></td><td>'+c[i].nome+'</td>');      
    }
    console.log(c);
  });

  (function($) {
    remove = function(item,comodoItem) {
      var tr = $(item).closest('tr');		
      tr.fadeOut(400, function() {
                  tr.remove();  		    
      });
    var sql = "DELETE FROM comodo where id = "+comodoItem+"";
    socket.emit("general-sql",sql);  
    return false;		  
    }		
  })(jQuery);

});

