var vrf = 0;
$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");
    var _statusDispositivoHistoricoList = new Array();
    var _stdh = new StatusDispositivoHistorico();
    var _comodo = new Comodo();
    var _comodoList = new Array();
    var _dispositivo = new Dispositivo();
    var _dispositivoLlist = new Array();
    var _listExtrato = new Array();

    socket.on("getComodos",function(result){
        $.each(result,function(index,item){
            _comodo.id = item.id;
            _comodo.nome = item.nome;
            _comodoList.push(_comodo);
            _comodo = new Comodo();
        });
    });

    socket.on("getDispositivos",function(result){
        $.each(result,function(index,item){
            _dispositivo.id = item.id;
            _dispositivo.nome = item.nome;
            _dispositivo.gasto = item.gasto;
            _dispositivo.dataCriacao = new Date(item.data_criacao);
            _dispositivoLlist.push(_dispositivo);
            _dispositivo = new Dispositivo();
        });
    });

    var lastNextItemID = 0;
    var verifica = 0;
    var saveOldData = new Array();
    var saveOldDataDispositivo = new Array();
    var valorAtualID = 0;
    socket.on("getExtratoGeral",function(result){
        vrf ++;
        if(vrf > 1){
            return;
        }
        //Montagem dos dados que serão utilizados
        $.each(result,function(index,item){
            _stdh.id = item.id;
            _stdh.idComodo = item.id_comodo;
            _stdh.idDispositivo = item.id_dispositivo;
            _stdh.data = new Date(item.data);
            _stdh.estado = item.estado;
            _statusDispositivoHistoricoList.push(_stdh);
            _stdh = new StatusDispositivoHistorico();
        });

        var extrato = new Extrato();
        var testeArray = new Array();
        var nomeDispositivo = "";
        var listaFiltradaDispositivo;
        var t = new Array();
        var listaFinal = new Array();

        $.each(_comodoList,function(indexc,comodo){            
            $.each(_dispositivoLlist,function(indexd,dispositivo){
                var auxCount = 0;                
                $.each(_statusDispositivoHistoricoList,function(){

                    var item = $(this).data('item',auxCount)[0];
                    
                    var auxNext = auxCount + 1;
                    var prox = [];
                    
                    if(auxNext <= _statusDispositivoHistoricoList.length){
                        prox = _statusDispositivoHistoricoList[auxNext];
                    }
                    
                    if(prox != undefined &&
                        lastNextItemID != item.id && 
                        item.idComodo == comodo.id && 
                        item.idDispositivo == dispositivo.id){
                            
                        lastNextItemID = prox.id;
                        var resultTempoDecorrido = dateFns.distanceInWordsStrict(item.data,prox.data);
                        
                        var estadoAtual = "Sem status";
                        var estadoProx = "Sem status";

                        var dataAtual = GenericaHoraDataFormatada(item.data);
                        var dataProx = GenericaHoraDataFormatada(prox.data);

                        if(item.estado == 0){
                            estadoAtual = "Ligado"
                        }else{
                            estadoAtual = "Desligado"
                        }

                        if(prox.estado == 0){
                            estadoProx = "Ligado"
                        }else{
                            estadoProx = "Desligado"
                        }


                        var diffData = CalculaHorasEntreDatas(item.data,prox.data);
                        var resultConsumo = CalculaConsumoDispositivo(diffData,dispositivo.gasto);

                        var html = '<tr><td>'+comodo.nome+'</td><td>'+dispositivo.nome+'</td><td>'+dataAtual+'</td><td>'+dataProx+'</td><td>'+resultTempoDecorrido+'</td><td>R$ '+resultConsumo.toFixed(3).replace('.',',')+'</td></tr>'
                        $("#list-extrato tr:last").after(html)

                    }
                    auxCount ++;
                });
            });
        });
    });
});