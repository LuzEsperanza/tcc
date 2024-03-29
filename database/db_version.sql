CREATE DATABASE butterfly;



USE butterfly;

CREATE TABLE IF NOT EXISTS Denunciante (
  denuncianteID  MEDIUMINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100),  
  senha VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL,
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
  codigo VARCHAR(255) UNIQUE,
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
  horaDenuncia DATE DEFAULT CURRENT_DATE,
  descricao TEXT NOT NULL,
  veracidade BOOLEAN,
  horarioAbordagem TIME,
  informacaoDenunciado TEXT,
  anonima MEDIUMINT,
  rua VARCHAR(30),
  numero INT,
  longitude  FLOAT(10,8) NOT NULL,
  latitude FLOAT(10,8) NOT NULL,
  encaminhado VARCHAR(30),
  condicao VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (identificado) REFERENCES Denunciante(denuncianteID) ON DELETE SET NULL,
  FOREIGN KEY (anonima) REFERENCES Anonimo(id) ON DELETE SET NULL
  
 
) ;
CREATE TABLE IF NOT EXISTS Foto (
  id MEDIUMINT NOT NULL AUTO_INCREMENT, 
  imagem_denuncia VARCHAR(500),
  denuncia MEDIUMINT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id) ON DELETE CASCADE
  
  
);

CREATE TABLE IF NOT EXISTS Analisa(
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  atendente MEDIUMINT NOT NULL, 
  denuncia MEDIUMINT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (atendente) REFERENCES Atendente(atendenteID) ON DELETE CASCADE,
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id)  ON DELETE CASCADE
  
);
CREATE TABLE IF NOT EXISTS Pertence(
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  crimeAmbiental  MEDIUMINT NOT NULL,
  denuncia MEDIUMINT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (crimeAmbiental) REFERENCES CrimeAmbiental(id)  ON DELETE CASCADE,
  FOREIGN KEY (denuncia) REFERENCES Denuncia(id)  ON DELETE CASCADE
  
);

ALTER TABLE Denuncia
MODIFY COLUMN veracidade BOOLEAN
DEFAULT TRUE;

ALTER TABLE Denuncia
MODIFY COLUMN encaminhado Varchar(30)
DEFAULT 'Técnico fiscal';

ALTER TABLE Denuncia
MODIFY COLUMN condicao Varchar(20)
DEFAULT 'Pendente';
