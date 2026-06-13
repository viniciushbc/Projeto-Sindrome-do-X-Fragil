function adminMiddleware(req, res, next) {
    if(!req.usuario){
        return res.status(401).json({
            message: 'Usuário não autenticado.'
        })
    }

    if (req.usuario.tipo_usuario !== 'ADMIN') {
        return res.status(403).json({
            message: 'Acesso negado.'
        })
    }

    return next();
}

module.exports = adminMiddleware;

