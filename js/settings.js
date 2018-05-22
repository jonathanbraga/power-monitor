$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");
    var _alarme = new Alarme();
    var _idNotificacao = new Array();


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

    //Recebe todos os comodos e adiciona no select
    socket.on("getComodosSemAlarme",function(d){
        for(i=0; i<d.length;i++){
            $('#select-comodo').append($('<option>', { 
            value: d[i].id,
            text : d[i].nome 
            }));
        }
    });

    // Cria um alarme com o comodo selecionado
    $("#criarAlarme").click(function(){
        var valorLimite = $("#inputLimite")[0].value;
        var comodoName = $( "#select-comodo option:selected" ).text();
        var comodoId = $( "#select-comodo option:selected" ).val();
        var sql = "";
        if(valorLimite != ""){
            sql = "INSERT INTO alarme (comodo_id,limite,created) VALUES ("+comodoId+","+valorLimite+",'"+HoraDataFormatada()+"')"
            socket.emit("general-sql", sql)
        }else{
            alert("Informe o valor do limite")
        }
    });
});