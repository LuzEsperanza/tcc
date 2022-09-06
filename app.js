const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaDenunciante = require('./routes/denunciante');
const rotaDenuncia = require('./routes/denuncia');
const rotaNomeDenunciado = require('./routes/nomeDenunciado');
const rotaFoto = require('./routes/foto');
const rotaAtendente = require('./routes/atendente');
const rotaRealiza = require('./routes/realiza');
const rotaAnalisa = require('./routes/analisa');
const rotaCrimeAmbiental = require('./routes/crimeAmbiental');
const rotaBusca = require('./routes/busca');
const rotaPertence = require('./routes/pertence')

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
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
app.use('/foto', rotaFoto);
app.use('/atendente', rotaAtendente);
app.use('/realiza', rotaRealiza);
app.use('/analisa', rotaAnalisa);
app.use('/crimeAmbiental', rotaCrimeAmbiental);
app.use('/busca', rotaBusca);
app.use('/pertence', rotaPertence);


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