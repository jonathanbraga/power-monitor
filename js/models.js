
// COMODO
function Comodo(id,nome){
    this.id = id || 0;
    this.nome = nome || '';
}

//Dispositivo
function Dispositivo(id,nome,gasto,dataCriacao){
    this.id = id || 0;
    this.nome = nome || "";
    this.gasto = gasto || 0;
    this.dataCriacao = dataCriacao || new Date();
}

// COMODO DISPOSITIVO
function ComodoDispositivo(quantidadeDispositivo, idComodo, idDispositivo){
    this.quantidadeDispositivo = quantidadeDispositivo || 0;
    this.idComodo = idComodo || 0;
    this.idDispositivo = idDispositivo || 0;
}

// STATUS DISPOSITIVO
function StatusDispositivo(id, estado, idDispositivo,idComodo){
    this.id = id || 0;
    this.estado = estado || 0;
    this.idDispositivo = idDispositivo || 0;
    this.idComodo = idComodo || 0;
}

//STATUS DISPOSITIVO HISTORICO
function StatusDispositivoHistorico(id,estado,data,idDispositivo,idComodo,gasto){
    this.id = id || 0;
    this.estado = estado ||  0;
    this.data = data || new Date();
    this.idDispositivo = idDispositivo || 0;
    this.idComodo = idComodo || 0;
    this.gasto = gasto || 0;
}

//NOTIFICAÇÕES
function Notification(id,message,isRead,created){
    this.id = id || 0;
    this.message = message || "";
    this.isRead =  isRead || false;
    this.created = created || new Date();
}

