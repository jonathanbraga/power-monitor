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
   id_dispositivo int,
   id_comodo int,
   PRIMARY KEY (id),
   foreign key (id_dispositivo) references dispositivo(id),
   foreign key (id_comodo) references comodo(id) 
);

CREATE TABLE selected_comodo(
   id int auto_increment,
   comodo_id int,
   PRIMARY KEY (id),
   foreign key (comodo_id) references comodo(id)
);

CREATE TABLE status_dispositivo_historico(
   id int auto_increment,
   estado BOOLEAN,
   data DATETIME,
   id_dispositivo int,
   id_comodo int,
   PRIMARY KEY (id),
   foreign key (id_dispositivo) references dispositivo(id),
   foreign key (id_comodo) references comodo(id)	 
);

CREATE TABLE select_dispositivo(
    id int auto_increment,
    dispositivo_id int,
    comodo_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (comodo_id) REFERENCES comodo(id),
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivo(id)
);

CREATE TABLE notification(
    id int auto_increment,
    message VARCHAR(255),
    isRead BOOLEAN,
    created DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE alarme(
    id int auto_increment,
    comodo_id int,
    limite int,
    created DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (comodo_id) REFERENCES comodo(id)
);

CREATE TABLE configuracao(
    id int auto_increment,
    tarifa DOUBLE,
    gasto_mensal DOUBLE,
    created DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE alarme_total(
    id int auto_increment,
    nome VARCHAR(255),
    limite int,
    month int,
    created_at DATETIME,
    PRIMARY KEY (id)
);
