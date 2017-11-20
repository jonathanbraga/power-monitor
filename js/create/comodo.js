$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
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
  //Remove item da lista
  (function($) {
    remove = function(item) {
      var tr = $(item).closest('tr');		
      tr.fadeOut(400, function() {
                  tr.remove();  		    
      });		
    return false;		  
    }		
  })(jQuery);

  //Cadastro - COMODO
  $("#form-comodo").submit(function(e){
    var sql = "INSERT INTO comodo (nome,quantidade,id_dispositivo) values "+_sqlAdd+" ;";
    socket.emit("add-comodo", sql);		
  });

  //List - Comodo
  socket.on("list-comodos",function(c){    
    for(i=0; i<c.length;i++)
    {
      $('#listagem-comodo tr:last').after('<tr><td>'+c[i].nome+'</td><td>'+c[i].comodo+'</td><td>'+c[i].dispositivo+'</td>');      
    }
    console.log(c);
  });

});

