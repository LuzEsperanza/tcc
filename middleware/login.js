const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];

    try{
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.denunciante = decode;
        next();

    }catch(error){
        return res.status(401).json({ mensagem: 'Email ou senha incorretos. Por favor, tente novamente.' });

    }
   

}

exports.opcional = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];

    try{
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.denunciante = decode;
        next();

    }catch(error){
       next();

    }
   

}

exports.atendente = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];

    try{
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.atendente = decode;
        next();

    }catch(error){
        return res.status(401).send({ mensagem: 'Falha na autenticação'})

    }
   

}