$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;
  var _sqlAdd;
  var moreone = 0;
  var _selectedComodoID;

  //Recebe todos os dispositivos
  socket.on("get-comodos",function(d){
    var icone;
    for(i=0; i<d.length;i++)
    {
      if(d[i].nome.toLowerCase() == "cozinha" ){
        icone = "fa fa-cutlery";
      }
      else if(d[i].nome.toLowerCase() == "jardim" ){
        icone = "fa fa-leaf";
      }
      else if(d[i].nome.toLowerCase() == "lavanderia" ){
        icone = "fa fa-pied-piper";
      }
      else if(d[i].nome.toLowerCase().indexOf("banheiro") != -1){
        icone = "fa fa-tint";
      }
      else if(d[i].nome.toLowerCase().indexOf("sala") != -1){
        icone = "fa fa-coffee";
      }
      else if(d[i].nome.toLowerCase().indexOf("quarto") != -1|| d[i].nome.toLowerCase().indexOf("suite") != -1){
        icone = "fa fa-bed";
      }
      else{
        icone = "";
      }
      $("#box-comodos").append('<button class="btn btn-app" type="button" onclick="comodo(this,'+d[i].id+')"><i class="'+icone+'"></i>'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
    }
    console.log(d);
  });

  // -------------------------------------------------- COMODO SELECIONADO ----------------------------------------------------  

  // Busca todos os dispositivos do comodo
  socket.on("get-dispositivo",function(d){
    for(i=0; i<d.length;i++)
    {
      $("#box-comodos").append('<button class="btn btn-app" type="button" onclick="comodo(this,'+d[i].id+')"><i class="'+icone+'"></i>'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></button>');
    }
    console.log(d);
  });

  // General Function
  (function($) {
    comodo = function(item,comodoItemID) {
      var sql = "UPDATE selected_comodo set comodo_id = "+comodoItemID+"";
      socket.emit("general-sql",sql);
      window.location.replace("comodo_selected.html");  
    return false;		  
    }
  })(jQuery);
});


