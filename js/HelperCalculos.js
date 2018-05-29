var socket = io.connect("http://localhost:8000");


// Pega a diferença entre duas datas e coloca em horas
function CalculaHorasEntreDatas (d1,d2){
    if(d1 != null && d2 != null)
    {
      var result = Math.abs(d2- d1) / 36e5;
      return result;
    }
  }

// Calcula o consumo no mês(30 dias) de um dispositivo
function CalculaConsumoDispositivo (horas,consumoDispositivo){
    var consumoTotal = (consumoDispositivo * horas)/720;
    consumoTotal = consumoTotal * 0.35;
    return consumoTotal;
}

// Formata a hora e a data para o banco de dados
function HoraDataFormatada(){
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

  return date;
}

// Calcula a porcentagem do consumo por comodo
function ProgressoConsumo(limite,gasto){
  var result = (gasto*100)/limite;
  return result;
}

function GenericaHoraDataFormatada(data){
  var tzoffset = (new Date(data)).getTimezoneOffset() * 60000; //offset in milliseconds
  var date = (new Date(data - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

  return date;
}