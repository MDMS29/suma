import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UsuarioService  from '../services/Usuario.service';

export const _Autorizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ServiceUsuario = new UsuarioService()
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
            req.usuario = usuario;
            return next();
        } catch (error) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }
    } catch (error) {
        console.error(error);
    }
};