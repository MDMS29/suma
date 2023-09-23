import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { _UsuarioService } from '../services/Service.Usuario';

export const Autorizacion = async (req: Request, res: Response, next: NextFunction) => {
    const ServiceUsuario = new _UsuarioService()
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('Token no proporcionado');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
            const usuario = await ServiceUsuario.BuscarUsuario(+decoded.id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            req.usuario = usuario;
            return next();
        } catch (error) {
            console.error('Error al verificar el token:', error);
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
};
