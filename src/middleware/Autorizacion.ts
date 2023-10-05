import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { _UsuarioService } from '../services/Service.Usuario';

export const _Autorizacion = async (req: Request, res: Response, next: NextFunction) => {
    const ServiceUsuario = new _UsuarioService()
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada');
        }
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
            const usuario = await ServiceUsuario.BuscarUsuario(decoded.id, '');
            if (usuario === undefined) {
                return res.json({ error: true, message: 'Usuario no encontrado' });
            }
            req.usuario = usuario[0];
            return next();
        } catch (error) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }
    } catch (error) {
        console.error(error);
    }
};
