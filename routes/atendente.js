const { hash } = require('bcrypt');
const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req, res, next)=>{
    

    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
        
        conn.query(
            'SELECT * FROM Atendente WHERE email = ?', [req.body.email],(error,results) =>{
                if(error){
                    return res.status(500).send({error: error})
                }
                if(results.length > 0){
                    res.status(409).send({mensagem: 'Atendente email já cadastrado '})
                }else{
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if(errBcrypt){
                            return res.status(500).send({error: errBcrypt})
                        }
                        conn.query(
                            'INSERT INTO Atendente (nome, email, senha) VALUES (?,?,?)',
                            [req.body.nome, req.body.email, hash],
                            (error, result) =>{
                                conn.release();
                                if (error){
            
                                    return res.status(500).send({error: error})
            
                                }
                                response = {
                                    mensagem: 'Atendente criado com sucesso',
                                    atendenteAtualizado :{
                                        id: result.id,
                                        nome: req.body.nome,
                                        email: req.body.email,
                                        senha: req.body.senha,
                                        
                                        request: {
                                            tipo: 'GET', 
                                            descricao: 'Returna todos os Atendentes', 
                                            url: 'http://localhost:3000/atendente' 
                                        }
                                    }
                                }
            
                                res.status(201).send(response);
            
                            })
            
                    });

                }
            })

        
    
        
        
    });
        
    
    
});

router.post('/login', (req, res, next) => {
   
    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({error: error})
        }

        const query = 'SELECT * FROM Atendente WHERE email = ?';

        conn.query(query, [req.body.email],(error, results ,fields) =>{
            conn.release();

            if(error){return res.status(500).send({error: error})}

            if(results.length < 1){
                return res.status(401).send({mensagem: 'Falha na autenticação'})

            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {

                if(err){
                    return res.status(401).send({ mensagem: 'Falha na autenticação'})

                }

                if(result){
                    const token = jwt.sign({
                        atendenteID: results[0].atendenteID,
                        email: results[0].email
                    },
                     process.env.JWT_KEY,
                     {
                        expiresIn: "1h"
                     });

                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação'})
            });


        });
        
    });
});

module.exports = router;
