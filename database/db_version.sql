CREATE DATABASE butterfly;



USE butterfly;

CREATE TABLE IF NOT EXISTS Denunciante (
  denuncianteID  MEDIUMINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100),  
  senha VARCHAR(225),
  email VARCHAR(225),
  PRIMARY KEY (denuncianteID)
  
);

CREATE TABLE  IF NOT EXISTS Atendente (
  atendenteID MEDIUMINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(225) NOT NULL,
  senha VARCHAR(225) NOT NULL,
  PRIMARY KEY (atendenteID)
);

CREATE TABLE IF NOT EXISTS Anonimo (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  token VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE  IF NOT EXISTS CrimeAmbiental(
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(30),
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS Denuncia (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  identificado MEDIUMINT,
  horaDenuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descricao TEXT,
  veracidade BOOLEAN,
  horarioAbordagem TIME,
  informacaoDenunciado TEXT,
  anonima MEDIUMINT,
  rua VARCHAR(30) NOT NULL,
  numero INT NOT NULL,
  longitude  FLOAT(10,8),
  latitude FLOAT(10,8),
  encaminhado VARCHAR(30),
  condicao VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (identificado) REFERENCES Denunciante(denuncianteID),
  FOREIGN KEY (anonima) REFERENCES Anonimo(id)
  
 
) ;
CREATE TABLE IF NOT EXISTS Foto (
  id MEDIUMINT NOT NULL AUTO_INCREMENT, 
  imagem_denuncia VARCHAR(500),
  denuncia MEDIUMINT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id)
  ON DELETE CASCADE 
  
);



CREATE TABLE IF NOT EXISTS Analisa(
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  atendente MEDIUMINT NOT NULL, 
  denuncia MEDIUMINT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (atendente) REFERENCES Atendente(atendenteID),
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id) 
  
);
CREATE TABLE IF NOT EXISTS Pertence(
   id MEDIUMINT NOT NULL AUTO_INCREMENT,
  crimeAmbiental  MEDIUMINT NOT NULL REFERENCES CrimeAmbiental(id) ,
  denuncia MEDIUMINT NOT NULL REFERENCES Denuncia(id),
  PRIMARY KEY(id),
  FOREIGN KEY (crimeAmbiental) REFERENCES CrimeAmbiental(id),
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id)
  
); 

