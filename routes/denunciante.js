const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os denunciantes
router.get('/', (req, res, next) =>{
   
   mysql.getConnection((error, conn)=>{
    if(error){
        return res.status(500).send({error: error})
    }
    conn.query(
        'SELECT * FROM Denunciante;', 
        [req.body.nome, req.body.senha, req.body.login],
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
                        login: denun.login,
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
router.post('/', (req, res, next)=>{
    

    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'INSERT INTO Denunciante (nome, senha, login) VALUES (?,?,?)',
            [req.body.nome, req.body.senha, req.body.login],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

                const response = {
                    mensagem: 'Denunciante atualizado com sucesso',
                    denuncianteAtualizado :{
                        denuncianteID: result.denuncianteID,
                        nome: req.body.nome,
                        senha: req.body.senha,
                        login: req.body.login,
                        request: {
                            tipo: 'GET', 
                            descricao: 'Returna todos os denunciantes', 
                            url: 'http://localhost:3000/denunciante' 
                        }
                    }
                }

                res.status(201).send(response);
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
                        login: result[0].login,
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
           
            'UPDATE Denunciante SET nome = ?, senha = ?, login = ? WHERE denuncianteID = ?',
            [req.body.nome, req.body.senha, req.body.login, req.body.denuncianteID],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }
                if(result.changedRows === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado denunciante com esse id'
                    })


                }
                
                const response = {
                    mensagem : 'Denuncia atualizado com sucesso',
                    denuncianteAtualizado: {
                        denuncianteID: req.body.denuncianteID,
                        nome: req.body.nome,
                        senha: req.body.senha,
                        login: req.body.login,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos od denunciantes',
                            url: 'http://localhost:3000/denunciante'+ req.body.denuncianteID
                        }
                    }
                }

                return res.status(202).send(response);

                
            }) 
        
    })
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
                            login: 'String'
                        }
                    }
                }

                 return res.status(202).send(response);
            }) 
        
    })
});

module.exports = router;
