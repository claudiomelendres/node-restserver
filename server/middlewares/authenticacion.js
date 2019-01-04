const jwt = require('jsonwebtoken');
// ==========================================
// Verificar Token
// ==========================================
let verificarToken = (req, res, next) => {

    let token = req.get('token'); // autorization en ves de token si se desea

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ==========================================
// Verificar Admin Role
// ==========================================

let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'Usuario no es admin'
            }
        });
    }

};


module.exports = {
    verificarToken,
    verificarAdmin_Role
}