$(document).ready(function(){
    var socket = io.connect("http://localhost:8000");

    $("#calcular").click(function(){
        $("#body-resultado").empty();

        var consumo = Number($("#consumoAparelho")[0].value);
        var espDias = Number($("#diasUsados")[0].value);
        var espHoras = Number($("#horasUsadas")[0].value);
        var tarifa = Number($("#tarifa")[0].value);

        var diasEmHoras = DayToHour(espDias);
        var valorMensal = CalculaConsumoDispositivoCompleto(diasEmHoras,consumo,tarifa).toFixed(4);
        var valorDiario = valorMensal/espDias;
        valorDiario = valorDiario.toFixed(4);
        console.log(valorMensal,valorDiario)

        $("#body-resultado").append('<h3><center><b>Valor por mês:</b></center> <br/> <center>R$ '+Number(valorMensal).toFixed(2).toString().replace('.',',')+' </center></h3>')
        $("#body-resultado").append('<hr/>')
        $("#body-resultado").append('<h3><center><b>Valor por dia:</b></center> <br/> <center>R$ '+Number(valorDiario).toFixed(2).toString().replace('.',',')+'</center></h3>')

        $("#modal-resultado").modal('show');
    });
});