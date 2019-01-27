const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/authenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`); //buscamos el path de la imagen

    if (fs.existsSync(pathImagen)) { // si el path existe 
        res.sendFile(pathImagen); // se regresa la imagen 
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg'); //caso contrario se regresa la noImage
        res.sendFile(noImagePath);
    }


})


module.exports = app;