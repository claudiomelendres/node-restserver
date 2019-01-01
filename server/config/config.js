// ====================================================
// Puerto
// ====================================================
process.env.PORT = process.env.PORT || 3000;

// ====================================================
// Entorrno
// ====================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================================================
// Base de Datos
// ====================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:Informatica3210.@ds147354.mlab.com:47354/cafe';
}

process.env.URLDB = urlDB;