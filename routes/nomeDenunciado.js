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
});

//Insere um denuncia
router.post('/', (req, res, next)=>{

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
                    mensagem: 'NomeDenunciado atualizado com sucesso',
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
});

//Retorna os dados de um denunciado
router.get('/:id', (req, res, next) =>{
    const id = req.params.id
    res.status(200).send({ 
        mensagem:'Usando o GET de',
        id : id
    });
});

router.patch('/', (req, res, next) =>{
    res.status(201).send({ 
        mensagem:'Usando o PATCH dentro'
    });
});

router.delete('/', (req, res, next) =>{
    res.status(201).send({ 
        mensagem:'Usando o DELETE dentro'
    });
});

module.exports = router;
