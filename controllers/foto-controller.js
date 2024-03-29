const mysql = require('../mysql');

exports.getFoto = async (req, res, next) =>{
    try{
        const result = await mysql.execute('SELECT * FROM Foto;')
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

    }catch(error){
        return res.status(500).send({error: error})
    }
   
  
 };
 
exports.postFoto = async (req, res, next)=>{
    console.log(req.files)
    try {
       
        const images = req.files.map((imagem) => imagem.filename);
        const denuncia = req.body.denuncia;
        for (const imagem_denuncia of images) {
            const query = 'INSERT INTO Foto (denuncia, imagem_denuncia) VALUES (?, ?)';
            const result = await mysql.execute(query, [denuncia, imagem_denuncia]);
        }

        const response = {
            mensagem: 'Fotos inseridas com sucesso',
            url: images.map((imagem) => `http://192.168.1.103:3000/${imagem}`)
        };

        res.status(201).json(response);
        
        
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisição' });
            
    } 
};

exports.getUmaFoto = async (req, res, next) =>{
    try{
        const query = 'SELECT * FROM Foto WHERE id = ?;';
        const result = await mysql.execute(query, [req.params.id]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado produto com este ID'
            })
        }
        const response = {
                    
            foto :{
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
        
        return res.status(200).send(response);

    }catch(error){
        return res.status(500).send({error: error})
    }
   
    
};

exports.pathFoto = async (req, res, next) =>{
    try{
        const queryid = 'SELECT * FROM Foto WHERE id = ?';
        const resultid = await mysql.execute(queryid, [req.body.id]);

        if (resultid.length === 0) {
            return res.status(404).send({ message: 'Foto enexiste'});
        }else{
            const query = 'UPDATE Foto SET imagem_denuncia = ? WHERE id = ?';
            await mysql.execute(query, [req.file.path, req.body.id]);
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


        }
    }catch(error){
        return res.status(500).send({error: error})

    }
   
};

exports.deleteFoto = async (req, res, next) =>{
    try{
        const query = 'DELETE FROM Foto WHERE id = ?';
        await mysql.execute(query, [req.body.id]);
        const response = {
            mensagem: 'Foto removida com sucesso',
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
    

    }catch(error){
        return res.status(500).send({error: error})

    }
    // mysql.getConnection((error, conn)=>{

    //     if(error){
    //         return res.status(500).send({error: error})
    //     }
    
        
    //     conn.query(
           
    //         'DELETE FROM Foto WHERE id = ?',
    //         [req.body.id],
    //         (error, resultado, field) => {
    //             conn.release();

    //             if(error){
    //                 return res.status(500).send({
    //                     error: error,
    //                     response: null

    //                 });
    //             }

    //             const response = {
    //                 mensagem: 'Foto removida com sucesso',
    //                 request: {
    //                     tipo: 'POST',
    //                     descricao: 'Insere uma foto',
    //                     url: 'http://localhost:3000/foto', 
    //                     body: {
    //                         id: 'String',
    //                         denuncia: 'String',
    //                         imagem_denuncia: 'String'
    //                     }
    //                 }
    //             }

    //              return res.status(202).send(response);
    //         }) 
        
    // })
};