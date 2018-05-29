
function PanelWarning(porcentagem,comodo){
    var p = '<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-warning"></i> Alerta!</h4>Cuidado! Já foram consumidos '+porcentagem+'% do limite de gastos do cômodo '+comodo+'.</div>';
    return p;
}

function PanelDanger(porcentagem,comodo){
    var p = '<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-warning"></i> Alerta!</h4>Cuidado! Já foram consumidos '+porcentagem+'% do limite de gastos do cômodo '+comodo+'</div>';
    return p;
}


function NumberMonthArray(){
    var result = [01,02,03,04,05,06,07,08,09,10,11,12];
    return result;
}

function NumberToMonth(data){
    var result = "";
    switch(data){
        case 01:
            result = "Janeiro"
            break;
        case 02:
            result = "Fevereiro";
            break;
        case 03:
            result = "Março";
            break;
        case 04:
            result = "Abril";
            break;
        case 05:
            result = "Maio";
            break;
        case 06:
            result = "Junho";
            break;
        case 07:
            result = "Julho";
            break;
        case 08:
            result = "Agosto";
            break;
        case 09:
            result = "Setembro";
            break;
        case 10:
            result = "Outubro";
            break;
        case 11:
            result = "Novembro";
            break;
        case 12:
            result = "Dezembro";
            break;
        default:
            result = "Não encontrado"
        
        return result;
    }
}