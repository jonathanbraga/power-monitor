$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;
  var _sqlAdd;
  var _sqlAddStatus;
  var moreone = 0;
  var _selectedComodoID;

  //Recebe o Dispostivo selecionado
  socket.on("get-selected-comodo", function(c){
    _selectedComodoID = c[0].id;
   jQuery("label[for='titleComodo']").html(c[0].nome);
  });

  //Recebe todos os dispositivos do comodo selecionado
  socket.on("get-dispositivos-selected-comodo",function(d){
    var icone;
    for(i=0; i<d.length;i++)
    {
      icone = "fa fa-cutlery";
      $("#box-dispositivos").append('<button class="btn btn-app" type="button" onclick="selectedDispositivo(this,'+d[i].id+')">'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
    }
    console.log(d);
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
    console.log(d);
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
      _sqlAddStatus = _sqlAddStatus + ",(0,'"+data+"',"+dispositivo_id+")";
    }
    else{
      _sqlAdd = "("+quantidade+", "+_selectedComodoID+", "+dispositivo_id+")"
      _sqlAddStatus = "(0,'"+data+"',"+dispositivo_id+")";
    }
    $("#inputQuantidade").val("");
  });

  //Adiciona dispostivo ao comodo
  $("#addDispositivoComodo").click(function(){
    var sqlAdd = "INSERT INTO comodo_dispositivo (quantidade_dispositivo,id_comodo,id_dispositivo) values "+_sqlAdd+" ;";
    socket.emit("general-sql", sqlAdd);

    var sqlAddStatus = "INSERT INTO status_dispositivo (estado,data_modificacao,id_dispositivo) values "+_sqlAddStatus+" ;";
    socket.emit("general-sql", sqlAddStatus);

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

    selectedDispositivo= function(item,dispositivo){
      alert(dispositivo);
      return false;
    }
  })(jQuery);
});


