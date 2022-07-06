const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaDenunciante = require('./routes/denunciante');
const rotaDenuncia = require('./routes/denuncia');
const rotaNomeDenunciado = require('./routes/nomeDenunciado')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Acces-Control-Allow-Origin', '*'),
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, ContentType, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});

    }
    next();
})

app.use('/denunciante', rotaDenunciante);
app.use('/denuncia', rotaDenuncia);
app.use('/nomeDenunciado', rotaNomeDenunciado);

app.use((req, res, next)=>{ 
    const erro = new Error('Não encontrada');
    erro.status = 404;
    next(erro);
});

app.use((error,req, res, next)=>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            messagem: error.message
        }
    });
});

module.exports = app;