import jwt from 'jsonwebtoken';
export const _ParseCorreo = (correo: any): string => {
    if (!EsString(correo)) {
        throw new Error("¡Correo Invalido!")
    }
    return correo;
}
export const _ParseClave = (correo: any): string => {
    if (!EsString(correo)) {
        throw new Error("¡Clave Invalida!")
    }
    return correo;
}

const EsString = (string: string): boolean => {
    return typeof string === 'string';
}


export const generarJWT = (id: number) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });

}
