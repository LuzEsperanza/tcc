const mysql = require('../mysql');
const jwt = require('jsonwebtoken');

exports.anonimo = async (req, res, next) => {
    try{
        const query = 'INSERT INTO Anonimo (token) VALUES (?)';
        const results = await mysql.execute(query, [ req.body.token ]);
        
        
            // const token = jwt.sign(
            //     {
                    
            //         id: results[0].id,
            //         token: results[0].result
            //     },
            //      process.env.JWT_KEY,
            //      {
            //         expiresIn: "1h"
            // });
            console.log('oi')
            const response = {
                        mensagem: 'Autenticado com sucesso',
                        token: token,
                        
                     }
                    return res.status(200).send(response);

        
           
        
    }catch(error){
        return res.status(500).send(res);
    }
   
   
};

 


