const mysql = require('../mysql');

exports.getDenuncia =  async (req, res, next) =>{
    try{
        const query = `SELECT Pertence.id,
                                Denuncia.identificado,
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
                        WHERE Denuncia.identificado = ?;
         `
        const result = await mysql.execute(query, [req.params.identificado])
        console.log(req.params.identificado)
        const response = {
            quantidade: result.length,
            denuncia: result.map( denunc => {
                return {
                    id: denunc.id,
                    identificado: denunc.identificado,
                    descricao: denunc.descricao,
                    horaDenuncia: denunc.horaDenuncia,
                    encaminhado: denunc.encaminhado,
                    condicao: denunc.condicao,
                                                
                    CrimeAmbiental: {
                        tilulo: denunc.titulo,
                    
                    },
                    Pertence: {
                        id: denunc.id,
                    
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
        
        
        const query = 'INSERT INTO Denuncia (identificado, descricao, horarioAbordagem , rua, numero,longitude, latitude, informacaoDenunciado) VALUES (?,?,?,?,?,?,?,?)';
        const result = await mysql.execute(query, [ 
            req.body.identificado,
            req.body.descricao,
            req.body.horarioAbordagem,
            req.body.rua,
            req.body.numero,           
            req.body.longitude,
            req.body.latitude,
            req.body.informacaoDenunciado
        ]);
       

        const response = {
            mensagem: 'Denuncia inserida com sucesso',
                denuncia :{
                    id: result.insertId,
                    identificado: req.body.identificado,
                    descricao: req.body.descricao,
                    horarioAbordagem: req.body.horarioAbordagem,
                    
                    
                    
                    rua: req.body.rua,
                    numero: req.body.numero,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                    informacaoDenunciado: req.body.informacaoDenunciado,
                    
                                
                    request: {
                        tipo: 'GET', 
                        descricao: 'Returna todos os denuncia', 
                        url: 'http://localhost:3000/denuncia' 
                    }
                }
        }
        
        return res.status(201).send(response.denuncia);

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
                informacaoDenunciado: result[0].informacaoDenunciado,
               
                rua: result[0].rua,
                numero: result[0].numero,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
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
                    informacaoDenunciado: 'String',
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

