CREATE TABLE dispositivo(
    id INT auto_increment,
    nome VARCHAR(255),
    estado BOOLEAN,
    data_hora DATETIME,
    PRIMARY KEY(id)
);

CREATE TABLE comodo (
    id INT auto_increment,
    nome VARCHAR(255),
    id_dispositivo int,
    PRIMARY KEY(id),
    FOREIGN key (id_dispositivo) REFERENCES dispositivo(id)
);