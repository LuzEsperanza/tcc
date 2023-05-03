const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const nodemailer = require('nodemailer')

exports.getDenunciante = async (req, res, next) =>{
   try{
        const result = await mysql.execute('SELECT * FROM Denunciante;')
        const response = {
            quantidade: result.length,
            denunciante: result.map( denun => {
                return {
                    denuncianteID: denun.denuncianteID,
                    nome: denun.nome, 
                    senha: denun.senha, 
                    email: denun.email,
                    request: {
                        tipo: 'GET', 
                        descricao: 'Retorna todos os detalhes um denunciante espefico', 
                        url: 'http://localhost:3000/denunciante/' + denun.denuncianteID
                    }
                }
            })
        }
        res.status(200).send(response.denunciante);

   }catch(error){
        return res.status(500).send({error: error})


   }
   
    
 };

 exports.postDenunciante = async (req, res, next)=>{

    try{
        const queryEmail = 'SELECT * FROM Denunciante WHERE email = ?'
        const resultEmail = await mysql.execute(queryEmail, [req.body.email]);
        

        if (resultEmail.length > 0) {
            return res.status(404).send({ message: 'Já existe email cadastrado'});
        }

        
        const hash = await bcrypt.hashSync(req.body.senha, 10);
        
        
        const query = 'INSERT INTO Denunciante (nome, email, senha) VALUES (?,?,?)';
        const result = await mysql.execute(query, [ req.body.nome, req.body.email, hash ]);
        console.log(result)
        const response = {
            mensagem: 'Denunciante criado com sucesso',
            denunciante :{
                id: result.id,
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                                        
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todos os denunciantes', 
                    url: 'http://localhost:3000/denunciante' 
                }
            }
        }
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "445bfd21d1ac51",
              pass: "8b59c21c49fbd6"
            }
          });
        var message = {
            from: "butterfly@butterfly.com.br",
            to: req.body.email,
            subject: "Seu email foi cadastrado",
            text: "Parabéns pelo seu cadastro",
            html: "<p>Bora denunciar</p>"
        };
        transport.sendMail(message, function (err){
            if(err)return res.status(400).json({
                erro: true,
                message: "E-mail não enviado"
            });
        })
          
          
         return res.status(201).send(response.denunciante);


    }catch(error){
        return res.status(500).send({error: error});

    }
        
};
exports.postSocial = async (req, res, next)=>{
    

    try{
        const queryToken = `SELECT * FROM Denunciante WHERE token = ?`
        const resultToken = await mysql.execute(queryToken, [req.body.token]);
        console.log(resultToken)
        if (resultToken.length > 0) {
            return res.status(404).send({ message: 'Já existe token cadastrado'});
        }
        else{
            const query = 'INSERT INTO Denunciante (token) VALUES (?)';
        
        const result = await mysql.execute(query, [ req.body.token]);
        console.log(result);
        
        const response = {
            mensagem: 'Denunciante criado com sucesso',
            denunciante :{
                id: result.id,
                token: req.body.token,
               
                                        
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todos os denunciantes', 
                    url: 'http://localhost:3000/denunciante' 
                }
            }
        }
       
         return res.status(201).send(response.denunciante);

        }
        
        


    }catch(error){
        return res.status(500).send({error: error});

    }
        
};
exports.getUmDenunciante = async (req, res, next) =>{
    try {
        const query = 'SELECT * FROM Denunciante WHERE denuncianteID = ?;';
        const result = await mysql.execute(query, [req.params.denuncianteID]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado denunciante com este ID'
            })
        }

        const response = {
                    
            denunciante :{
                denuncianteID: result[0].denuncianteID,
                nome: result[0].nome,
                senha: result[0].senha,
                email: result[0].email,
                request: {
                    tipo: 'GET', 
                    descricao: 'Returna todos os denunciantes', 
                    url: 'http://localhost:3000/denunciante' 
                }
                                
            }
        }
        
                       
        
        return   res.status(200).send(response.denunciante);


    } catch (error) {
        return res.status(500).send({error: error});
    }
    
    
    
};

exports.patchDenunciante = async (req, res, next) =>{
    try {
        const queryEmail = 'SELECT * FROM Denunciante WHERE email = ?';
        const resultEmail = await mysql.execute(queryEmail, [req.body.email]);

        if (resultEmail.length > 0 && resultEmail.id !== req.body.id) {
            return res.status(404).send({ message: 'Já existe email cadastrado'});
        }else{
            const hash = await bcrypt.hashSync(req.body.senha, 10);
            const query = 'UPDATE Denunciante SET email = ?, senha = ? WHERE denuncianteID = ?';
            await mysql.execute(query, [
                req.body.email,
                hash,
                req.params.denuncianteID
            ]);
            const response = {
                mensagem : 'Denunciante atualizado com sucesso',
                denuncianteAtualizado: {
                    denuncianteID: req.params.denuncianteID,
                    email: req.body.email,
                    senha: req.body.senha,
                    
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os de talahes  de um denunciante',
                        url: 'http://localhost:3000/denunciante'+ req.body.denuncianteID
                    }
                }
            }

            return res.status(202).send(response);
            

        }

    } catch (error) {
        return res.status(500).send({error: error});
    }
   
};

exports.deleteDenunciante = async (req, res, next) =>{
    try {
        const query = 'DELETE FROM Denunciante WHERE denuncianteID = ?';
        await mysql.execute(query, [req.body.denuncianteID ]);
        const response = {
            mensagem: 'Denunciante removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um denunciante',
                url: 'http://localhost:3000/denunciante', 
                body: {
                    nome: 'String',
                    senha: 'String',
                    email: 'String'
                }
            }
        }

         return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({error: error});
    }
    
};

exports.loginDenunciante = async (req, res, next) => {
    try{
        const query = 'SELECT * FROM Denunciante WHERE email = ?';
        const results = await mysql.execute(query, [ req.body.email]);
        if(results.length < 1){
            return res.status(401).send({mensagem: 'Falha na autenticação'})

        }
        bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {

            if(err){
                return res.status(401).send({ mensagem: 'Falha na autenticação'})

            }

            if(result){
               
                const token = jwt.sign({
                    denuncianteID: results[0].denuncianteID,
                    email: results[0].email
                },
                 process.env.JWT_KEY,
                 {
                    expiresIn: "1d"
                 });
                const response = {
                    mensagem: 'Autenticado com sucesso',
                    token: token,
                    denunciante: {
                        denuncianteID: results[0].denuncianteID,
                        token: token
                    }

                 }
                return res.status(200).send(response);
            }
            return res.status(401).send(res);
        })
    }catch(error){
        return res.status(500).send(res);
    }
   
   
};

