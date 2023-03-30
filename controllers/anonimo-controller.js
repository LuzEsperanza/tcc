const mysql = require('../mysql');

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

 


