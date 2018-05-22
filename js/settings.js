$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");
    var _alarme = new Alarme();
    var _idNotificacao = new Array();
    var _configuracao = new Configuracao();
    var _flagEditar = 0;
    var _idParametros;


    // Nome do botão
    $("#criarParametro").html("Confirmar");

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

    //Recebe os Parâmetros do sistema
    socket.on("getConfiguracao",function(result){
        if(result.length > 0){
            $.each(result,function(index,item){
                _idParametros = item.id;
                $("#inputTarifa").val(item.tarifa);
                $("#inputGastoMensal").val(item.gasto_mensal);

                $("#inputTarifa").attr('readonly', true);
                $("#inputGastoMensal").attr('readonly', true);
                $("#criarParametro").prop('disabled', true);
            })
        }
    });

    // Habilita a opção de editar os parâmetros
    $("#editaParametro").click(function(){
        $("#inputTarifa").attr('readonly', false);
        $("#inputGastoMensal").attr('readonly', false);

        $("#criarParametro").prop('disabled', false);
        $("#criarParametro").html("Alterar");

        _flagEditar = 1;
    });

    //Adiciona os parâmetros ao banco
    $("#criarParametro").click(function(){
        var tarifa = $("#inputTarifa")[0].value;
        var gastoMensal = $("#inputGastoMensal")[0].value;

        if(_flagEditar == 0){    
            if(tarifa != "" && gastoMensal != ""){
                var sql = "INSERT INTO configuracao (tarifa,gasto_mensal,created) VALUES ("+tarifa+","+gastoMensal+",'"+HoraDataFormatada()+"')"
                socket.emit("general-sql",sql);
            }else{
                alert("Preencha todos os dados obrigatorios");
            }
        }else{
            var sql = "UPDATE configuracao SET tarifa = "+tarifa+", gasto_mensal = "+gastoMensal+" WHERE id = "+_idParametros+";"
            socket.emit("general-sql",sql);
        }


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