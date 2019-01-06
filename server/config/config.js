// ====================================================
// Puerto
// ====================================================
process.env.PORT = process.env.PORT || 3000;

// ====================================================
// Entorrno
// ====================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================================
// Vencimiento del token
// ====================================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ====================================================
// SEED de autenticacion
// ====================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarollo';

// ====================================================
// Base de Datos
// ====================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ====================================================
// Google Client ID
// ====================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '585327256136-1hbf66mbue2a2ngrnqs8m0cas4fgsnjf.apps.googleusercontent.com';