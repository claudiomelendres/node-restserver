const express = require('express');
const _ = require('underscore');

const { verificarToken, verificarAdmin_Role } = require('../middlewares/authenticacion');

let app = express();

let Categoria = require('../models/categoria');


app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email') // para popular el parametro usuario
        .exec((err, categorias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    total: conteo
                });
            });
        });
});


app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

app.post('/categoria', verificarToken, (req, res) => {
    let idUsuario = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: idUsuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let idUsuario = req.usuario._id;
    let body = _.pick(req.body, ['nombre', 'usuario']);
    body.usuario = idUsuario;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    // solo un admin puede borrar 
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe '
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });

});



module.exports = app;