$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;
  var _sqlAdd;
  var moreone = 0;

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
      $("#box-comodos").append('<a class="comodoClick btn btn-app"><i class="'+icone+'"></i>'+d[i].nome+' <label hidden="hidden" class="idComodo">sss</label></a>');
    }
    console.log(d);
  });

  $(".comodoClick").click(function(){
    alert("s");
  });

});

