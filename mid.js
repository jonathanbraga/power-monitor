$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;
  var dispositivos = new Array();

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





//Cadastro - COMODO
  $("#form-comodo").submit(function(e){
    var nome = $("#comodoNome").val();
    ready = true;
    var a = $( "#select-dispositivo option:selected" ).text();
    alert(a);
		socket.emit("add-comodo", nome);
  });

});

