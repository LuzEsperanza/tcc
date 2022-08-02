const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');


const storage = multer.diskStorage({ 
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);

    }else{
        cb(null, false);
    }


}

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
});

//Retorna todas as fotos
router.get('/', (req, res, next) =>{
   
   mysql.getConnection((error, conn)=>{
    if(error){
        return res.status(500).send({error: error})
    }
    conn.query(
        'SELECT * FROM Foto;', 
       
        (error, result, fields) => {
            conn.release();
            if(error){
                return res.status(500).send({error: error})
            }
            const response = {
                quantidade: result.length,
                fotos: result.map( fot => {
                    return {
                        id: fot.id,
                        denuncia: fot.denuncia,
                        imagem_denuncia: fot.imagem_denuncia,
                        
                        
                        request: {
                            tipo: 'GET', 
                            descricao: 'Retorna todos os detalhes uma foto espefico', 
                            url: 'http://localhost:3000/foto/' + fot.id
                        }
                    }
                })
            }
            res.status(200).send(response);

        }
    )

   });
});

//Insere uma foto
router.post('/', upload.single('foto_imagem'), (req, res, next)=>{
    console.log(req.file.path);

    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'INSERT INTO Foto (denuncia, imagem_denuncia) VALUES (?,?)',
            [req.body.denuncia, req.file.path],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null

                    });
                }

                const response = {
                    mensagem: 'Foto inserida com sucesso',
                    fotoAtualizado :{
                        id: result.id,
                        denuncia: req.body.denuncia,
                        imagem_denuncia: req.file.path,
                        
                        request: {
                            tipo: 'GET', 
                            descricao: 'Returna todas as fotos', 
                            url: 'http://localhost:3000/denunciante' 
                        }
                    }
                }

                res.status(201).send(response);
            }) 
        
    })
    
});

//Retorna os dados de um denunciante
router.get('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
        
        conn.query(
           
            'SELECT * FROM Foto WHERE id = ?;',
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
                        mensagem: 'Não foi encontrada foto  com esse id'
                    })


                }

                const response = {
                    
                    denunciante :{
                        id: result[0].id,
                        denuncia: result[0].denuncia,
                        imagem_denuncia: result[0].imagem_denuncia,
                        
                        request: {
                            tipo: 'GET', 
                            descricao: 'Returna todas as fotos', 
                            url: 'http://localhost:3000/foto' 
                        }
                        
                    }
                }

               

                res.status(200).send(response);
            }) 
        
    })
    
    
});

//Altera um denunciante 
router.patch('/', upload.single('foto_imagem'), (req, res, next) =>{
    mysql.getConnection((error, conn)=>{

        if(error){
            return res.status(500).send({error: error})
        }
    
        
        conn.query(
           
            'UPDATE Foto SET imagem_denuncia = ? WHERE id = ?',
            [req.file.path, req.body.id],
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
                    mensagem : 'Foto atualizado com sucesso',
                    denuncianteAtualizado: {
                        id: req.body.id,
                        imagem_denuncia: req.body.imagem_denuncia,
                       
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os detalhes de uma foto',
                            url: 'http://localhost:3000/foto/' + req.body.id
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
           
            'DELETE FROM Foto WHERE id = ?',
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
                    mensagem: 'Denunciante removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere uma foto',
                        url: 'http://localhost:3000/foto', 
                        body: {
                            id: 'String',
                            denuncia: 'String',
                            imagem_denuncia: 'String'
                        }
                    }
                }

                 return res.status(202).send(response);
            }) 
        
    })
});

module.exports = router;
