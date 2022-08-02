const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Retorna todos os denunciantes
router.get('/', (req, res, next) =>{
   
   mysql.getConnection((error, conn)=>{
    if(error){
        return res.status(500).send({error: error})
    }
    conn.query(
        'SELECT * FROM Denunciante;', 
        [req.body.nome, req.body.senha, req.body.email],
        (error, result, fields) => {
            conn.release();
            if(error){
                return res.status(500).send({error: error})
            }
            const response = {
                quantidade: result.length,
                denunciante: result.map( denun => {
                    return {
                        denuncianteID: denun.denuncianteID,
                        nome: denun.nome, 
                        senha: denun.senha, 
                        email: denun.email,
                        request: {
                            tipo: 'GET', 
                            descricao: 'Retorna todos os detalhes um denunciante espefico', 
                            url: 'http://localhost:3000/denunciante/' + denun.denuncianteID
                        }
                    }
                })
            }
            res.status(200).send(response);

        }
    )

   });
});

//Insere um denunciante
router.post('/cadastro', (req, res, next)=>{
    

    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }   
        conn.query(
            'SELECT * FROM Denunciante WHERE email = ?', [req.body.email],(error,results) =>{
                if(error){
                    return res.status(500).send({error: error})
                }
                if(results.length > 0){
                    res.status(409).send({mensagem: 'Email do Denunciante já cadastrado '})
                }else{
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if(errBcrypt){
                            return res.status(500).send({error: errBcrypt})
                        }
                        conn.query(
                            'INSERT INTO Denunciante (nome, email, senha) VALUES (?,?,?)',
                            [req.body.nome, req.body.email, hash],
                            (error, result) =>{
                                conn.release();
                                if (error){
            
                                    return res.status(500).send({error: error})
            
                                }
                                response = {
                                    mensagem: 'Denunciante criado com sucesso',
                                    atendenteAtualizado :{
                                        id: result.id,
                                        nome: req.body.nome,
                                        email: req.body.email,
                                        senha: req.body.senha,
                                        
                                        request: {
                                            tipo: 'GET', 
                                            descricao: 'Returna todos os denunciantes', 
                                            url: 'http://localhost:3000/denunciante' 
                                        }
                                    }
                                }
            
                                res.status(201).send(response);
            
                            })
            
                    });

                }
            })
   
    })
    
});

//Retorna os dados de um denunciante
router.get('/:denuncianteID', (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
        
        conn.query(
           
            'SELECT * FROM Denunciante WHERE denuncianteID = ?;',
            [req.params.denuncianteID],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado denunciante com esse id'
                    })


                }

                const response = {
                    
                    denunciante :{
                        denuncianteID: result[0].denuncianteID,
                        nome: result[0].nome,
                        senha: result[0].senha,
                        email: result[0].email,
                        request: {
                            tipo: 'GET', 
                            descricao: 'Returna todos os denunciantes', 
                            url: 'http://localhost:3000/denunciante' 
                        }
                        
                    }
                }

               

                res.status(200).send(response);
            }) 
        
    })
    
    
});

//Altera um denunciante 
router.patch('/', (req, res, next) =>{
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
                            'UPDATE Denunciante SET email = ?, senha = ? WHERE denuncianteID = ?',
                            [req.body.email, hash, req.body.denuncianteID],
                            (error, result) =>{
                                conn.release();
                                if(error){
                                    return res.status(500).send({
                                        error: error,
                                        response: null
                
                                    });
                                }
                                console.log(result.changedRows);
                                if(result.changedRows === 0){
                                    return res.status(404).send({
                                        mensagem: 'Não foi encontrado denunciante com esse id'
                                    })
                
                
                                }
                                
                                const response = {
                                    mensagem : 'Denunciante atualizado com sucesso',
                                    denuncianteAtualizado: {
                                        denuncianteID: req.body.denuncianteID,
                                        email: req.body.email,
                                        senha: req.body.senha,
                                        
                                        request: {
                                            tipo: 'GET',
                                            descricao: 'Retorna todos os de talahes  de um denunciante',
                                            url: 'http://localhost:3000/denunciante'+ req.body.denuncianteID
                                        }
                                    }
                                }
                
                                return res.status(202).send(response);
                                
                                
            
                                
            
                            })
            
                    });

                }
            })

        
    
        
        
    });
});

router.delete('/', (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'DELETE FROM Denunciante WHERE denuncianteID = ?',
            [req.body.denuncianteID],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

                const response = {
                    mensagem: 'Denunciante removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um denunciante',
                        url: 'http://localhost:3000/denunciante', 
                        body: {
                            nome: 'String',
                            senha: 'String',
                            email: 'String'
                        }
                    }
                }

                 return res.status(202).send(response);
            }) 
        
    })
});

router.post('/login', (req, res, next) => {
   
    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({error: error})
        }

        const query = 'SELECT * FROM Denunciante WHERE email = ?';

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
                        denuncianteID: results[0].denuncianteID,
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
