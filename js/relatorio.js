// Verifica os dados repetidos
var vrf = 0;
//Datas para a contrução dos dados
var data = new Date();
var currentMonth = data.getMonth(); // organizar grafico por dia
var lastMonth = data.getMonth()-1; // organizar grafico por dia
var currentYear = data.getFullYear(); // organizar grafico por mês


$(document).ready(function(){
    $("#list-extrato").DataTable();
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

        //Salvando os tipos de dados
        var dadosByCurrentMonth = new Array();
        $.each(_statusDispositivoHistoricoList,function(index,item){
            if(item.data.getMonth() == currentMonth){
                dadosByCurrentMonth.push(item);
            }
        });

        var dadosByLastMonth = new Array();
        $.each(_statusDispositivoHistoricoList,function(index,item){
            if(item.data.getMonth() == lastMonth){
                dadosByLastMonth.push(item);
            }
        });

        var dadosByCurrentYear = new Array();
        $.each(_statusDispositivoHistoricoList,function(index,item){
            if(item.data.getFullYear() == currentYear){
                dadosByCurrentYear.push(item);
            }
        });

        var last3Months = new Array();
        $.each(_statusDispositivoHistoricoList,function(index,item){
            if(item.data.getMonth() == currentMonth || 
               item.data.getMonth() == new Date().getMonth() -1 ||
               item.data.getMonth() == new Date().getMonth() -2){

                last3Months.push(item);
            }
        });
        
        var _chartData = new Array();
        var datahora = new Date();

        $.each(_comodoList,function(indexc,comodo){            
            $.each(_dispositivoLlist,function(indexd,dispositivo){
                var auxCount = 0;   
                var resultConsumo = 0;             
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

                        datahora = item.data.getMonth()+1;
                        datadia = item.data.getDate();
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
                        resultConsumo = CalculaConsumoDispositivo(diffData,dispositivo.gasto);
                        _chartData.push({id:comodo.id,name:comodo.nome,data:resultConsumo,datahora:datahora,datadia:datadia});

                        //var html = '<tr><td>'+comodo.nome+'</td><td>'+dispositivo.nome+'</td><td>'+dataAtual+'</td><td>'+dataProx+'</td><td>'+resultTempoDecorrido+'</td><td>R$ '+resultConsumo.toFixed(3).replace('.',',')+'</td></tr>'
                        
                        var t = $("#list-extrato").DataTable();
                        t.row.add([
                            comodo.nome,
                            dispositivo.nome,
                            dataAtual,
                            dataProx,
                            resultTempoDecorrido,
                           "R$ " + resultConsumo.toFixed(3).replace('.',',')
                        ]).draw(false);
                        

                    }
                    auxCount ++;
                });
            });
        });
        //Gŕaficos

        //Ordenando o array para por ordem de mês
        _chartData.sort(function(a,b){return a.datahora-b.datahora;});

        console.log(_chartData);

        var vetorData = [];
        var dataFull = new Array();
        $.each(_comodoList, function(i,comodo){
            var v1 = 0;
            var v2 = 0;
            var v3 = 0;
            var v4 = 0;
            var v5 = 0;
            var v6 = 0;
            var v7 = 0;
            var v8 = 0;
            var v9 = 0;
            var v10 = 0;
            var v11 = 0;
            var v12 = 0;
            $.each(_chartData, function(j,item){
                if(comodo.id == item.id){

                    if(item.datahora == 1){
                        v1 = v1 + item.data;
                    }
                    else if(item.datahora == 2){
                        v2 = v2 + item.data;
                    }
                    else if(item.datahora == 3){
                        v3 = v3 + item.data;
                    }
                    else if(item.datahora == 4){
                        v4 = v4 + item.data;
                    }
                    else if(item.datahora == 5){
                        v5 = v5 + item.data;
                    }
                    else if(item.datahora == 6){
                        v6 = v6 + item.data;
                    }
                    else if(item.datahora == 7){
                        v7 = v7 + item.data;
                    }
                    else if(item.datahora == 8){
                        v8 = v8 + item.data;
                    }
                    else if(item.datahora == 9){
                        v9 = v9 + item.data;
                    }
                    else if(item.datahora == 10){
                        v10 = v10 + item.data;
                    }
                    else if(item.datahora == 11){
                        v11 = v11 + item.data;
                    }
                    else if(item.datahora == 12){
                        v12 = v12 + item.data;
                    }
                }
            });
            vetorData = [Number(v1.toFixed(4)),Number(v2.toFixed(4)),Number(v3.toFixed(4)),Number(v4.toFixed(4)),Number(v5.toFixed(4)),Number(v6.toFixed(4)),Number(v7.toFixed(4)),Number(v8.toFixed(4)),Number(v9.toFixed(4)),Number(v10.toFixed(4)),Number(v11.toFixed(4)),Number(v12.toFixed(4))];
            //console.log(vetorData)
            dataFull.push({name:comodo.nome,data:vetorData});
        });
        Line_Chart('container',dataFull,"Consumo geral de todos os dispostividos por cômodo ao longo do ano")

        var vetorDataFullDias = new Array();
        var vetorDia = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        $.each(_comodoList,function(i,comodo){
            var saveday = new Array();
            $.each(_chartData,function(j,item){
                if(item.id == comodo.id){
                    //mês passado
                    if(item.datahora == new Date().getMonth()){
                        if(saveday.length > 0){
                            var check = 0;
                            $.each(saveday,function(k,day){
                                if(item.datadia == day.day && item.datahora == day.month){
                                    vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4)) + Number(item.data.toFixed(4));
                                    vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                                    check++;
                                }
                            });
                            if(check == 0){
                                vetorDia[item.datadia] = Number(item.data.toFixed(4));
                                vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                                saveday.push({month:item.datahora,day:item.datadia})
                                check = 0;
                            }
                        }else{
                            saveday.push({month:item.datahora,day:item.datadia})
                            vetorDia[item.datadia] = Number(item.data.toFixed(4));
                            vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                        }
                    }
                }
            });
            vetorDataFullDias.push({name:comodo.nome,data:vetorDia})
            vetorDia = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
        console.log(vetorDataFullDias);
        Line_Chart_Days('containerr',vetorDataFullDias,"Consumo geral de todos os dispostividos por cômodo ao longo do mês anterior")


        //dispositvo mês atual
        var vetorDataFullDias = new Array();
        var vetorDia = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        $.each(_comodoList,function(i,comodo){
            var saveday = new Array();
            $.each(_chartData,function(j,item){
                if(item.id == comodo.id){
                    //mês atual
                    if(item.datahora == new Date().getMonth()+1){
                        if(saveday.length > 0){
                            var check = 0;
                            $.each(saveday,function(k,day){
                                if(item.datadia == day.day && item.datahora == day.month){
                                    vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4)) + Number(item.data.toFixed(4));
                                    vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                                    check++;
                                }
                            });
                            if(check == 0){
                                vetorDia[item.datadia] = Number(item.data.toFixed(4));
                                vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                                saveday.push({month:item.datahora,day:item.datadia})
                                check = 0;
                            }
                        }else{
                            saveday.push({month:item.datahora,day:item.datadia})
                            vetorDia[item.datadia] = Number(item.data.toFixed(4));
                            vetorDia[item.datadia] = Number(vetorDia[item.datadia].toFixed(4));
                        }
                    }
                }
            });
            vetorDataFullDias.push({name:comodo.nome,data:vetorDia})
            vetorDia = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
        console.log(vetorDataFullDias);
        Line_Chart_Days('chart-device-current-month',vetorDataFullDias,"Consumo geral de todos os dispostividos por cômodo ao longo do mês atual")
    });
});