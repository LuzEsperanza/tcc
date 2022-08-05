const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getNomeDenunciado = (req, res, next) =>{

    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({error: error})
        }
        conn.query(
            'SELECT * FROM NomeDenunciado;', 
            [req.body.nomeDenunciado],
            (error, result, fields) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }
                const response = {
                    quantidade: result.length,
                    denunciante: result.map( nome => {
                        return {
                            id: nome.id,
                            nomeDenunciado: nome.nomeDenunciado,
                            request: {
                                tipo: 'GET', 
                                descricao: 'Retorna todos os detalhes um nomeDenunciado espefico', 
                                url: 'http://localhost:3000/denunciante/' + nome.id
                            }
                        }
                    })
                }
                res.status(200).send(response);
    
            }
        )
    
       });
};

exports.postNomeDenunciado = (req, res, next)=>{

    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'INSERT INTO NomeDenunciado (nomeDenunciado) VALUES (?)',
            [req.body.nomeDenunciado],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

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
            }) 
        
    })
};

