const mysql = require('../mysql');

exports.postPertence = async (req, res, next)=>{
   

    try{
                
        const query = 'INSERT INTO Pertence (crimeAmbiental, denuncia) VALUES (?,?)';
        const result = await mysql.execute(query, [ req.body.crimeAmbiental, req.body.denuncia]);
        const response = {
            mensagem: 'Pertence criado com sucesso',
            denuncianteAtualizado :{
                id: result.id,
                crimeAmbiental: req.body.crimeAmbiental,
                denuncia: req.body.denuncia,
                
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todas as tabela pertence', 
                    url: 'http://localhost:3000/pertence' 
                }
            }
        }
         return res.status(201).send(response);


    }catch(error){
        return res.status(500).send({error: error});

    }
        
};