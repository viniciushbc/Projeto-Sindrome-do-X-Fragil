const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não informado.'
        })
    }


    const [tipo, token] = authHeader.split(' ');

    if(tipo !== 'Bearer' || !token){
        return res.status(401).json({
            message: 'Formato do token inválido.'
        })
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id_usuario: tokenDecoded.id_usuario,
            nome: tokenDecoded.nome,
            tipo_usuario: tokenDecoded.tipo_usuario
        };

        return next();
    } catch(error) {
        return res.status(401).json({
            message: 'Token inválido ou expirado.'
        })
    }
}

module.exports = authMiddleware;