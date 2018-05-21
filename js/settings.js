$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");


    //Recebe todos os comodos e adiciona no select
    socket.on("get-comodos",function(d){
        for(i=0; i<d.length;i++)
            {
                $('#select-dispositivo').append($('<option>', { 
                value: d[i].id,
                text : d[i].nome 
                }));
            }
        });
});