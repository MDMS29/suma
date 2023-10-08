import jwt from 'jsonwebtoken';

export const _ParseCorreo = (correo: any): string => {
    if (!EsString(correo)) {
        throw new Error("¡Correo Invalido!")
    }
    return correo;
}
export const _ParseClave = (clave: any): string => {
    if (!EsString(clave)) {
        throw new Error("¡Clave Invalida!")
    }
    return clave;
}

const EsString = (string: string): boolean => {
    return typeof string === 'string';
}

// FUNCION PARA GENERAR EL TOKEN DE ACCESO DEL USUARIO
export const generarJWT = (id: number) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });

}

// ESTADOS SEGUN LA TABLA DE ESTADO EN LA BASE DE DATOS
export const EstadosTablas = {
    ESTADO_ACTIVO : 1,
    ESTADO_INACTIVO : 1
}