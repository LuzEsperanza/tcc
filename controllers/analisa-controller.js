const mysql = require('../mysql');

exports.postAnalisa = async (req, res, next)=>{
    console.log(req.atendente.antendenteID)

    try{
                
        const query = 'INSERT INTO Analisa (atendente, denuncia) VALUES (?,?)';
        const result = await mysql.execute(query, [ req.atendente.atendenteID, req.params.id_denuncia]);
        const response = {
            mensagem: 'Realiza criado com sucesso',
            denuncianteAtualizado :{
                id: result.id,
                atendente: req.atendente.atendenteID,
                denuncia: req.params.id_denuncia,
                
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todas as denuncians realizadas', 
                    url: 'http://localhost:3000/realiza' 
                }
            }
        }
         return res.status(201).send(response);


    }catch(error){
        return res.status(500).send({error: error});

    }
        
};