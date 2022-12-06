const mysql = require('../mysql');

exports.getRealiza = async (req, res, next) =>{
    try{
         const query = 'SELECT * FROM Realiza WHERE denunciante = ?';
         const result = await mysql.execute(query, [ req.denunciante.denuncianteID]);
         const response = {
             quantidade: result.length,
             realiza: result.map( reali => {
                 return {
                    id: reali.id,
                    denunciante: req.denunciante.denuncianteID,
                    denuncia: reali.denuncia,
                    horaDenuncia : reali.horaDenuncia,
                    request: {
                         tipo: 'GET', 
                         descricao: 'Retorna todos os detalhes um denunciante espefico', 
                         url: 'http://localhost:3000/realiza/' + reali.id
                     }
                 }
             })
         }
         res.status(200).send(response);
 
    }catch(error){
         return res.status(500).send({error: error})
 
 
    }
    
     
  };

exports.postRealiza = async (req, res, next)=>{
    console.log(req.denunciante.denuncianteID)

    try{
                
        const query = 'INSERT INTO Realiza (denunciante, denuncia) VALUES (?,?)';
        const result = await mysql.execute(query, [ req.denunciante.denuncianteID, req.params.id_denuncia]);
        const response = {
            
            mensagem: 'Realiza criado com sucesso',
            denuncianteAtualizado :{
                id: result.id,
                denunciante: req.denunciante.denuncianteID,
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


