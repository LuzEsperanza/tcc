const mysql = require('../mysql');

exports.getDenuncia =  async (req, res, next) =>{
    try{
        const query = `SELECT Denuncia.id,
                                Denuncia.denunciante,
                                Denuncia.descricao, 
                                Denuncia.horaDenuncia,
                                Denuncia.encaminhado,
                                Denuncia.condicao,
                     
                                CrimeAmbiental.titulo
                        FROM Pertence
                            INNER JOIN Denuncia 
                             ON Denuncia.id = Pertence.denuncia 
                            INNER JOIN CrimeAmbiental 
                              ON Pertence.crimeAmbiental = CrimeAmbiental.id
                        WHERE Denuncia.denunciante = ?;
         `
        const result = await mysql.execute(query, [req.params.denunciante])
        const response = {
            quantidade: result.length,
            denuncia: result.map( denunc => {
                return {
                    id: denunc.id,
                    denunciante: denunc.denunciante,
                    descricao: denunc.descricao,
                    horaDenuncia: denunc.horaDenuncia,
                    encaminhado: denunc.encaminhado,
                    condicao: denunc.condicao,
                                                
                    CrimeAmbiental: {
                        tilulo: denunc.titulo,
                    
                    },                            
                                                
                    request: {
                        tipo: 'GET', 
                        descricao: 'Retorna todos os detalhes um denunciante espefico', 
                        url: 'http://localhost:3000/denunciante/' + denunc.id
                    }
                }
            })
        }
        res.status(200).send(response.denuncia);

    

    }catch(error){
        return res.status(500).send({error: error});

    }
    
};


exports.postDenuncia = async (req, res, next)=>{
    try{
        const queryNomeDenunciado = 'SELECT * FROM NomeDenunciado WHERE id = ?';
        const resultNomeDenunciado = await mysql.execute(queryNomeDenunciado, [req.body.id]);

        if (resultNomeDenunciado.length > 0) {
            return res.status(404).send({ message: 'Não foi encontrado nome Denunciado com esse id'});
        }
        
        const query = 'INSERT INTO Denuncia (denunciante, descricao, horarioAbordagem , rua, numero, complemento,longitude, latitude) VALUES (?,?,?,?,?,?,?,?)';
        const result = await mysql.execute(query, [ 
            req.body.denunciante,
            req.body.descricao,
            req.body.horarioAbordagem,
            req.body.rua,
            req.body.numero,
            req.body.complemento,
            req.body.longitude,
            req.body.longitude
        ]);

        const response = {
            mensagem: 'Denuncia inserida com sucesso',
                denuncia :{
                    id: result.id,
                    denunciante: req.body.denunciante,
                    descricao: req.body.descricao,
                    horarioAbordagem: req.body.horarioAbordagem,
                    
                    complemento: req.body.complemento,
                    
                    rua: req.body.rua,
                    numero: req.body.numero,
                    
                    geometria: req.body.geometria,
                                
                    request: {
                        tipo: 'GET', 
                        descricao: 'Returna todos os denuncia', 
                        url: 'http://localhost:3000/denuncia' 
                    }
                }
        }
        
        return res.status(201).send(response);

    }catch(error){
        return res.status(500).send({error: error});
    }
   

   
};

exports.getUmaDenuncia = async (req, res, next) =>{
    try {
        const query = 'SELECT * FROM Denuncia WHERE id = ?';
        const result = await mysql.execute(query, [req.params.id]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado denuncia com esse id'
            })
        }

        const response = {
                    
            denuncia :{
                id: result[0].id,
                descricao: result[0].descricao,
                veracidade: result[0].veracidade,
                horarioAbordagem: result[0].horarioAbordagem,
                nomeDenunciado: result[0].nomeDenunciado,
                estado: result[0].estado,
                cidade: result[0].cidade,
                rua: result[0].rua,
                numero: result[0].numero,
                bairro: result[0].bairro,
                cep: result[0].cep,
                geometria: result[0].geometria,
                encaminhado: result[0].encaminhado,
                condicao: result[0].condicao,
                               
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todos as denuncias', 
                    url: 'http://localhost:3000/denuncia' 
                }
                                
            }
        }
        
                       
        
        res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
    
};

exports.pathDenuncia = async (req, res, next) =>{
    try {
        const query = 'UPDATE Denuncia SET veracidade = ?, encaminhado = ?, condicao = ? WHERE id = ?';
        await mysql.execute(query, [
            req.body.veracidade,
            req.body.encaminhado,
            req.body.condicao, req.body.id
        ]);
        const response = {
            mensagem : 'Denuncia atualizado com sucesso',
            denunciaAtualizado: {
                id: req.body.id,
                veracidade: req.body.veracidade,
                encaminhado: req.body.encaminhado,
                condicao: req.body.condicao,
                
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os de talahes  de uma denuncia',
                    url: 'http://localhost:3000/denuncia'+ req.body.id
                }
            }
        }

        return res.status(202).send(response);


    } catch (error) {
        return res.status(500).send({error: error});
    }
   
};

exports.deleteDenuncia = async (req, res, next) =>{
    try {
        const query = 'DELETE FROM Denuncia WHERE id = ?';
        await mysql.execute(query, [req.body.id]);
        const response = {
            mensagem: 'Denuncia removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um denuncia',
                url: 'http://localhost:3000/denuncia', 
                body: {
                    nome: 'String',
                    id: 'Number',
                    descricao: 'String',
                    veracidade: 'Boolean',
                    horarioAbordagem: 'time',
                    nomeDenunciado: 'String',
                    estado: 'String',
                    cidade: 'String',
                    rua: 'String',
                    numero: 'Number',
                    bairro: 'String',
                    cep: 'String',
                    geometria: 'Decimal',
                    encaminhado: 'String',
                    condicao: 'String',
                }
            }
        }

         return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({error: error});
    }
    
};

