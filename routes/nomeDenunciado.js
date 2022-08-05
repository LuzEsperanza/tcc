const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

const login = require('../middleware/login');

const NomeDenunciadoController = require('../controllers/nomeDenunciado-controller');

router.get('/', NomeDenunciadoController.getNomeDenunciado);

router.post('/', NomeDenunciadoController.postNomeDenunciado);

router.get('/:id', (req, res, next) =>{
    const id = req.params.id
    res.status(200).send({ 
        mensagem:'Usando o GET de',
        id : id
    });
});

router.patch('/', (req, res, next) =>{
    res.status(201).send({ 
        mensagem:'Usando o PATCH dentro'
    });
});

router.delete('/', (req, res, next) =>{
    res.status(201).send({ 
        mensagem:'Usando o DELETE dentro'
    });
});

module.exports = router;
