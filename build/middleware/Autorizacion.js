"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autorizacion = void 0;
const Autorizacion = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        next();
    }
    else {
        res.status(401).json({
            mensaje: 'No autorizado'
        });
    }
};
exports.Autorizacion = Autorizacion;
