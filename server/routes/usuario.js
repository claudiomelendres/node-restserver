const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');


const app = express();

app.get('/usuario', function(req, res) {

    let estadoUsr = req.query.estado;
    if (!estadoUsr) {
        estadoUsr = true;
    }
    //estadoUsr = Boolean(estadoUsr);

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: estadoUsr }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: estadoUsr }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        total: conteo,
                        estadoUsr
                    });

                }).skip(desde)
                .limit(limite)

        });
});



app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = '_'; // para no mandar el pass como respuesta

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});



app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //pick : retorna una copia del objeto con esos campos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // new : para que muestre el nuevo registro en el retorno
    // runValidators : para que corra las validaciones
    // context : hay un issue con el correo con esto lo evitamos

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


// // Borrado permanente de la Base de Datos
// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         };

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }



//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     });

// });

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;