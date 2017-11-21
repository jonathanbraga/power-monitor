CREATE TABLE dispositivo(
    id INT auto_increment,
    nome VARCHAR(255),
    gasto DOUBLE,
    data_criacao DATETIME,
    PRIMARY KEY(id)
);

CREATE TABLE comodo (
    id INT auto_increment,
    nome VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE comodo_dispositivo(
   quantidade_dispositivo int,
   id_comodo int,
   id_dispositivo int,
   primary key (id_comodo, id_dispositivo),
   foreign key (id_comodo) references comodo(id),
   foreign key (id_dispositivo) references dispositivo(id)
);

CREATE TABLE status_dispositivo(
   id int auto_increment,
   estado BOOLEAN,
   data_modificacao DATETIME,
   id_dispositivo int,
   PRIMARY KEY (id),
   foreign key (id_dispositivo) references dispositivo(id) 
);
