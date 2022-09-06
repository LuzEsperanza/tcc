const mysql = require('../mysql');

exports.getBusca = async (req, res, next) =>{
    try{
        let condicao =''
        if(req.query.condicao){
            titulo = req.body.condicao;

        }
         
         const query = `SELECT *
                            FROM Denuncia, NomeDenunciado
                            WHERE Denuncia.condicao LIKE '%${condicao}%' AND NomeDenunciado.id = Denuncia.nomeDenunciado
                            `;
          
         const result = await mysql.execute(query,[req.body.condicao])
         const response = {
             quantidade: result.length,
             denuncia: result.map( denunc => {
                 return {
                    id: denunc.id,
                    descricao: denunc.descricao,
                    veracidade: denunc.veracidade,
                    horarioAbordagem: denunc.horarioAbordagem,
                    anonima: denunc.anonima,
                    estado: denunc.estado,
                    cidade: denunc.cidade,
                    rua: denunc.rua,
                    numero: denunc.numero,
                    bairro: denunc.bairro,
                    cep: denunc.cep,
                    geometria: denunc.geometria,
                    encaminhado: denunc.encaminhado,
                    condicao: denunc.condicao,

                    NomeDenunciado: {
                        nomeDenunciado: denunc.nomeDenunciado,
                    
                    }, 

                  
                                                
                     request: {
                         tipo: 'GET', 
                         descricao: 'Retorna todos os detalhes de uma denuncia', 
                         url: 'http://localhost:3000/denuncia/' + denunc.id
                     }
                 }
             })
         }
         res.status(200).send(response);
 
    }catch(error){
         return res.status(500).send({error: error})
 
 
    }
    
     
  };