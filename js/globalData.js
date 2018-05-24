
function PanelWarning(porcentagem,comodo){
    var p = '<div class="alert alert-warning alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-warning"></i> Alerta!</h4>Cuidado! Já foram consumidos '+porcentagem+'% do limite de gastos do cômodo '+comodo+'.</div>';
    return p;
}

function PanelDanger(porcentagem,comodo){
    var p = '<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-warning"></i> Alerta!</h4>Cuidado! Já foram consumidos '+porcentagem+'% do limite de gastos do cômodo '+comodo+'</div>';
    return p;
}