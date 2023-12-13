import jwt from 'jsonwebtoken';

// FUNCION PARA GENERAR EL TOKEN DE ACCESO DEL USUARIO
export const Generar_JWT = (id: number) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });

}

//FUNCION PARA GENERAR LLAVES ALEATORIAS
export const Generar_Llaves_Secretas = () => {
    const random = Math.random().toString(15).substr(2);
    const fecha = Date.now().toString(15)
    return random + fecha
}
