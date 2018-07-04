
function Vertical_Chart(_chartData, title){
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        yAxis: {
            min: 0.00,
            title: {
                text: 'Consumo (R$)'
            }
        },
        xAxis:{
            title:{
                text: "Dispositivos"
            }
        },
        tooltip: {
            valueDecimals: 4,
            valuePrefix: 'R$ ',
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: _chartData
        });
}

function Horizontal_Chart(_chartData,title){
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: title
        },
        yAxis: {
            min: 0.00,
            title: {
                text: 'Consumo (R$)'
            }
        },
        xAxis:{
            title:{
                text: "Cômodos"
            }
        },
        tooltip: {
            valueDecimals: 4,
            valuePrefix: 'R$ '
        },
        plotOptions: {
            series: {
                shadow:false,
                borderWidth:0,
                pointPadding:0
            }
        },
        series: _chartData
      });
}

function Line_Chart(idDiv,_chartData,title){
    Highcharts.chart(''+idDiv+'', {
        chart: {
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            title:{
                text:"MÊSES DO ANO"
            }
        },
        yAxis: {
            title: {
                text: 'Consumo (R$)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: _chartData
    });
}

var days = [];
var cont = 1;
for(i = 0; i< 31;i++){
    days[i] = ''+cont+'';
    cont++;
}

function Line_Chart_Days(idDiv,_chartData,title){
    Highcharts.chart(''+idDiv+'', {
        chart: {
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: days,
            title:{
                text: 'DIAS DO MÊS'
            }
        },
        yAxis: {
            title: {
                text: 'Consumo (R$)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: _chartData
    });
}