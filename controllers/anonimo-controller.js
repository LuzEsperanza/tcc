const mysql = require('../mysql');
const jwt = require('jsonwebtoken');

exports.anonimo = async (req, res, next) => {
    try{
        
        const query = 'INSERT INTO Anonimo (codigo) VALUES (?)';
        const result = await mysql.execute(query, [req.body.codigo]);
        
              
        const response = {
            mensagem: 'Autenticado com sucesso',
            
            anonimo: {
                id: result.insertId,
                codigo: req.body.codigo
            }
                    
        }
        return res.status(200).send(response.anonimo);

        
           
        
    }catch(error){
        return res.status(500).send({error: error});
    }
   
   
};
exports.loginAnonimo = async (req, res, next) => {
    console.log(req.body.codigo)
    try{
        const query = 'SELECT * FROM Anonimo WHERE codigo = ?';
        const results = await mysql.execute(query, [ req.body.codigo]);
        
        if(results.length < 1){
            return res.status(401).send({mensagem: 'Falha na autenticação'})

        }
        else{
            

            const token = jwt.sign({
                id: results[0].id,
               codigo: results[0].codigo
            },
             process.env.JWT_KEY,
             {
                expiresIn: "1d"
             });
            const response = {
                mensagem: 'Autenticado com sucesso',
                token: token,
                denunciante: {
                    id: results[0].id,
                    token: token
                }

             }
            return res.status(200).send(response);

        }

            
               
          
           
       
    }catch(error){
        return res.status(500).send(res);
    }
   
   
};

 


