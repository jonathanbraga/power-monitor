
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
                text: 'Consumo em reais'
            }
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
                text: 'Consumo em reais'
            }
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