const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os denuncia
router.get('/', (req, res, next) =>{

    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({error: error})
        }
        conn.query(
            `SELECT Denuncia.descricao, 
                    Denuncia.veracidade,
                    Denuncia.horarioAbordagem,
                    Denuncia.nomeDenunciado,
                    Denuncia.estado,
                    Denuncia.cidade,
                    Denuncia.rua,
                    Denuncia.numero,
                    Denuncia.bairro,
                    Denuncia.cep,
                    Denuncia.geometria,
                    Denuncia.encaminhado,
                    Denuncia.condicao,
                    Denuncia.tipoAtividade,
                    NomeDenunciado.nomeDenunciado
               FROM Denuncia
             INNER JOIN NomeDenunciado 
                    ON NomeDenunciado.id = Denuncia.nomeDenunciado;`, 
            
            (error, result, fields) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }
                const response = {
                    quantidade: result.length,
                    denuncia: result.map( denunc => {
                        return {
                            id: denunc.id,
                            descricao: denunc.descricao,
                            veracidade: denunc.veracidade,
                            horarioAbordagem: denunc.horarioAbordagem,
                            anonima: denunc.anonima,
                            estado: denunc.estado,
                            cidade: denunc.cidade,
                            rua: denunc.rua,
                            numero: denunc.numero,
                            bairro: denunc.bairro,
                            cep: denunc.cep,
                            geometria: denunc.geometria,
                            encaminhado: denunc.encaminhado,
                            condicao: denunc.condicao,
                            tipoAtividade: denunc.tipoAtividade,
                            NomeDenunciado: {
                                nomeDenunciado: denunc.nomeDenunciado,

                            },                            
                            
                            request: {
                                tipo: 'GET', 
                                descricao: 'Retorna todos os detalhes um denunciante espefico', 
                                url: 'http://localhost:3000/denunciante/' + denunc.id
                            }
                        }
                    })
                }
                res.status(200).send(response);
    
            }
        )
    
       });
});

//Insere um denuncia
router.post('/', (req, res, next)=>{

    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({error: error})
        }

        conn.query(
            'SELECT * FROM NomeDenunciado WHERE id = ?',
            [req.body.nomeDenunciado],
            (error, result, fields) => {
               
                if(error){
                    return res.status(500).send({error: error})
                }

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nome Denunciado com esse id'
                    })
                }

                conn.query(
           
            'INSERT INTO Denuncia (descricao, horarioAbordagem , nomeDenunciado, estado, cidade, rua, numero, bairro, cep, geometria, tipoAtividade) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [
                req.body.descricao,
                req.body.horarioAbordagem,
                req.body.nomeDenunciado,
                req.body.estado,
                req.body.cidade,
                req.body.rua,
                req.body.numero,
                req.body.bairro,
                req.body.cep,
                req.body.geometria,
                req.body.tipoAtividade

            ],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

                const response = {
                    mensagem: 'Denuncia atualizado com sucesso',
                    denunciaAtualizado :{
                        id: result.id,
                        descricao: req.body.descricao,
                        horarioAbordagem: req.body.horarioAbordagem,
                        nomeDenunciado: req.body.nomeDenunciado,
                        estado: req.body.estado,
                        cidade: req.body.cidade,
                        rua: req.body.rua,
                        numero: req.body.numero,
                        bairro: req.body.bairro,
                        cep: req.body.cep,
                        geometria: req.body.geometria,
                        tipoAtividade: req.body.tipoAtividade,
                        request: {
                            tipo: 'GET', 
                            descricao: 'Returna todos os denuncia', 
                            url: 'http://localhost:3000/denuncia' 
                        }
                    }
                }

                res.status(201).send(response);
            }) 

                
               
    
            }
        )
        
    })

   
});

//Retorna os dados de um denuncia
router.get('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
        
        conn.query(
           
            'SELECT * FROM Denuncia WHERE id = ?;',
            [req.params.id],
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
                        mensagem: 'Não foi encontrado denuncia com esse id'
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
                        tipoAtividade: result[0].tipoAtividade,
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
            }) 
        
    })
    
});

router.patch('/', (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'UPDATE Denuncia SET veracidade = ?, tipoAtividade = ?, encaminhado = ?, condicao = ? WHERE id = ?',
            [req.body.veracidade, req.body.tipoAtividade, req.body.encaminhado, req.body.condicao, req.body.id],
            (error, result, field) => {
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
                        mensagem: 'Não foi encontrado denuncia com esse id'
                    })


                }
                
                const response = {
                    mensagem : 'Denuncia atualizado com sucesso',
                    denunciaAtualizado: {
                        id: req.body.id,
                        tipoAtividade: req.body.tipoAtividade,
                        condicao: req.body.condicao,
                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos od denuncia',
                            url: 'http://localhost:3000/denuncia'+ req.body.denuncia
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
           
            'DELETE FROM Denuncia WHERE id = ?',
            [req.body.id],
            (error, resultado, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

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
                            tipoAtividade: 'String',
                            encaminhado: 'String',
                            condicao: 'String',
                        }
                    }
                }

                 return res.status(202).send(response);
            }) 
        
    })
});

module.exports = router;
