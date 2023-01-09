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

CREATE TABLE IF NOT EXISTS NomeDenunciado( 
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  nomeDenunciado VARCHAR(100),
  PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS Denuncia (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  denunciante MEDIUMINT,
  horaDenuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descricao TEXT,
  veracidade BOOLEAN,
  horarioAbordagem TIME,
  nomeDenunciado MEDIUMINT,
  anonima INT,
  rua VARCHAR(30) NOT NULL,
  numero INT NOT NULL,
  longitude DECIMAL,
  latitude DECIMAL,
  encaminhado VARCHAR(30),
  condicao VARCHAR(20),
   PRIMARY KEY (id),
  FOREIGN KEY (nomeDenunciado) REFERENCES NomeDenunciado(id) 
  ON DELETE NO ACTION,
  FOREIGN KEY (denunciante) REFERENCES Denunciante(denuncianteID) ON DELETE NO ACTION
  
 
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

ALTER TABLE `Pertence` ADD CONSTRAINT `fk_crimeAmbiental` FOREIGN KEY ( `crimeAmbiental` ) REFERENCES `CrimeAmbiental` ( `id` ); 
ALTER TABLE `Pertence` ADD CONSTRAINT `fk_denuncia` FOREIGN KEY ( `denuncia` ) REFERENCES `Denuncia` ( `id` ); 