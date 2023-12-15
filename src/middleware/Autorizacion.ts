import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UsuarioService from '../services/Configuracion/Usuario.Service';

export const _Autorizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service_usuario = new UsuarioService()
        if (!process.env.JWT_SECRET) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada');
        }
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
            const usuario = await service_usuario.Buscar_Usuario(decoded.id, '');
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


export const _Recoleccion_IP = async (_: Request, __: Response, next: NextFunction) => {
    try {
        const data = await fetch('https://ipinfo.io?token=70210017b789f6')
        const json = await data.json()
        console.log('------------------------------------------------')
        console.log('IP Cliente: ' + json.ip)
        console.log(`Ubicación: ${json.country} ${json.region}/${json.city}`)
        console.log('Fecha:', new Date(Date.now()))
        console.log('------------------------------------------------')
        next()
    } catch (error) {
        next()
        console.log(error)
    }
}