const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getCrimeAmbiental = async (req, res, next) =>{
    try{
        const result = await mysql.execute('SELECT * FROM CrimeAmbiental;');
         const response = {
                    quantidade: result.length,
                    crimeAmbiental: result.map( crime => {
                        return {
                            id: crime.result.id,
                            titulo: crime.result.titulo,
                            request: {
                                tipo: 'GET', 
                                descricao: 'Retorna um crime ambiental', 
                                url: 'http://localhost:3000/crimeAmbiental/' + crime.id
                            }
                        }
                    })
                }
                res.status(200).send(response.crimeAmbiental);

    }catch(error){
        return res.status(500).send({error: error});
    }
   
};

exports.postCrimeAmbiental = async (req, res, next)=>{
    
    try{
                
        const query = 'INSERT INTO CrimeAmbiental (titulo) VALUES (?)';
        const result = await mysql.execute(query, [ req.body.titulo]);
        const response = {
            mensagem: 'Crime Ambiental criado com sucesso',
            denuncianteAtualizado :{
                id: result.id,
                titulo: req.body.titulo,
                                
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todas os crimes ambientais adicionados', 
                    url: 'http://localhost:3000/crimeAmbientais' 
                }
            }
        }
         return res.status(201).send(response);


    }catch(error){
        return res.status(500).send({error: error});

    }
        
};

exports.getUmCrimeAmbiental = async (req, res, next) =>{
    try{
        const query = 'SELECT * FROM CrimeAmbiental WHERE id = ?;';
        const result = await mysql.execute(query, [req.params.id]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado um crime ambiental com este ID'
            })
        }
        const response = {
                    
            crime :{
                id: result[0].id,
                crime: result[0].titulo,
               
                                
                    request: {
                        tipo: 'GET', 
                        descricao: 'Returna todos os crimes ambientais', 
                        url: 'http://localhost:3000/crimeAmbientais' 
            }
                                
        }
    }
        
        return res.status(200).send(response);

    }catch(error){
        return res.status(500).send({error: error})
    }
   
    
};

exports.deleteCrimeAmbiental = async (req, res, next) =>{
    try{
        const query = 'DELETE FROM CrimeAmbiental WHERE id = ?';
        await mysql.execute(query, [req.body.id]);
        const response = {
            mensagem: 'Crime ambiental removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um crime ambiental',
                url: 'http://localhost:3000/crimeAmbiental', 
                body: {
                    id: 'String',
                    denuncia: 'String',
                    imagem_denuncia: 'String'
                }
            }
        }

         return res.status(202).send(response);
    

    }catch(error){
        return res.status(500).send({error: error})

    }
    
};