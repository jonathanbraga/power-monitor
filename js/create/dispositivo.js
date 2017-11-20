$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;

//Create dispositivo
  $("#form-dispositivo").submit(function(e){
    var nome = $("#inputNome").val();
    var gasto = $("#inputGasto").val();
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var sql = "INSERT INTO dispositivo (nome,estado,gasto,data_criacao,data_modificacao) values ('"+nome+"',0,"+gasto+",'"+date+"','"+date+"')";
    socket.emit("add-dispositivo", sql);
  });

  //List Dispositivos
  socket.on("get-dispositivos",function(c){    
    for(i=0; i<c.length;i++)
    {
      $('#listagem-dispositivos tr:last').after('<tr><td>'+c[i].nome+'</td><td>'+c[i].estado+'</td><td>'+c[i].gasto+' kw/h</td>><td>'+c[i].data_criacao+'</td>><td>'+c[i].data_modificacao+'</td>');      
    }
    console.log(c);
  });
});

