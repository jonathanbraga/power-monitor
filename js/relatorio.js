$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");
    var _statusDispositivoHistoricoList = new Array();
    var _stdh = new StatusDispositivoHistorico();
    var _comodo = new Comodo();
    var _comodoList = new Array();
    var _dispositivo = new Dispositivo();
    var _dispositivoLlist = new Array();

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

    socket.on("getExtratoGeral",function(result){
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

        $.each(_comodoList,function(indexc,comodo){
            console.log(comodo.nome)
            $.each(_dispositivoLlist,function(indexd,dispositivo){                
                $.each(_statusDispositivoHistoricoList,function(index,item){
                    if(item.idComodo == comodo.id && item.idDispositivo == dispositivo.id){
                        console.log(item.idComodo,item.idDispositivo);
                    }
                });
            });
        });
    });
});