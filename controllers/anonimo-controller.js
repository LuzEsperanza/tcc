const mysql = require('../mysql');
const jwt = require('jsonwebtoken');

exports.anonimo = async (req, res, next) => {
    try{
        const token = jwt.sign(
            {
                
               
               
            },
             process.env.JWT_KEY,
             {
                expiresIn: "1h"
        });
        const query = 'INSERT INTO Anonimo (token) VALUES (?)';
        const result = await mysql.execute(query, [token]);
        
        console.log(result)        
        const response = {
            mensagem: 'Autenticado com sucesso',
            // token: token,
            anonimo: {
                id: result.insertId,
            }
                    
        }
        return res.status(200).send(response.anonimo);

        
           
        
    }catch(error){
        return res.status(500).send({error: error});
    }
   
   
};

 


