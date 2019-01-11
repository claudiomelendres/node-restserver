const express = require('express');
const _ = require('underscore');

const { verificarToken } = require('../middlewares/authenticacion');


let app = express();
let Producto = require('../models/producto');


app.get('/producto', verificarToken, (req, res) => {

    let disponibleProd = req.query.disponible || true;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: disponibleProd })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: disponibleProd }, (err, conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        total: conteo
                    });
                }).skip(desde)
                .limit(limite)
        })

});

app.get('/producto/:id', verificarToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

app.post('/producto', verificarToken, (req, res) => {
    let idUsuario = req.usuario._id;
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: idUsuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});


app.put('/producto/:id', verificarToken, (req, res) => {
    let idProducto = req.params.id;
    let idUsuario = req.usuario._id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible', 'usuario']);
    body.usuario = idUsuario;

    Producto.findByIdAndUpdate(idProducto, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.delete('/producto/:id', verificarToken, (req, res) => {
    // disponible pase a falso
    let idProducto = req.params.id;
    let idUsuario = req.usuario._id;
    let body = _.pick(req.body, ['disponible', 'usuario']);
    body.usuario = idUsuario;
    body.disponible = false;

    Producto.findByIdAndUpdate(idProducto, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto Borrado'
        });
    });
});


app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productosDB
            });
        });
});


module.exports = app;