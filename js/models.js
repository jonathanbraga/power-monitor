
// COMODO
function Comodo(id,nome){
    this.id = id || 0;
    this.nome = nome || '';
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