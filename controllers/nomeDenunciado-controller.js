const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getNomeDenunciado = async (req, res, next) =>{
    try{
        const result = await mysql.execute('SELECT * FROM NomeDenunciado;');
         const response = {
                    quantidade: result.length,
                    denunciado: result.map( nome => {
                        return {
                            id: nome.id,
                            nomeDenunciado: nome.nomeDenunciado,
                            request: {
                                tipo: 'GET', 
                                descricao: 'Retorna todos os detalhes um nomeDenunciado espefico', 
                                url: 'http://localhost:3000/nomeDenunciado/' + nome.id
                            }
                        }
                    })
                }
                res.status(200).send(response);

    }catch(error){
        return res.status(500).send({error: error});
    }
   
};

exports.postNomeDenunciado = async (req, res, next)=>{
    try{
        const query = 'INSERT INTO NomeDenunciado (nomeDenunciado) VALUES (?)';
        const result = await mysql.execute(query, [req.body.nomeDenunciado]);
        const response = {
            mensagem: 'NomeDenunciado inserido com sucesso',
            nomeAtualizado :{
                id: result.id,
                nomeDenunciado: req.body.nomeDenunciado,
                
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todos os denunciados', 
                    url: 'http://localhost:3000/denuncia' 
                }
            }
        }

        res.status(201).send(response);

    }catch(error){
        return res.status(500).send({error: error});
    }

   
};

