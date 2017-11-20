CREATE TABLE dispositivo(
    id INT auto_increment,
    nome VARCHAR(255),
    estado BOOLEAN,
    gasto DOUBLE,
    data_criacao DATETIME,
    data_modificacao DATETIME,
    PRIMARY KEY(id)
);

CREATE TABLE comodo (
    id INT auto_increment,
    nome VARCHAR(255),
    quantidade int,
    id_dispositivo int,
    PRIMARY KEY(id),
    FOREIGN key (id_dispositivo) REFERENCES dispositivo(id)
);

CREATE TABLE comodo_dispositivo(
   id_comodo int,
   id_dispositivo int,
   primary key (id_comodo, id_dispositivo),
   foreign key (id_comodo) references comodo(id),
   foreign key (id_dispositivo) references dispositivo(id)
);
