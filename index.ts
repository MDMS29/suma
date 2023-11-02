import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import logger from 'morgan'
import { _UsuarioRouter } from './src/routes/Configuracion/UsuarioRoutes';
import { _PerfilesRouter } from './src/routes/Configuracion/PerfilesRoutes';
import { _ModulosRouter } from './src/routes/Configuracion/ModulosRoutes';
import { _RolesRouter } from './src/routes/Configuracion/RolesRoutes';
import { _MenusRouter } from './src/routes/Configuracion/MenuRoutes';
import { _EmpresasRouter } from './src/routes/EmpresaRoutes';
import { _OpcionesBasicasRouter } from './src/routes/Opciones_Basicas/BasicasRoute';
import { _ProductosRouter } from './src/routes/Opciones_Basicas/ProductosRoute';

const app = express();
// DEFINIR TIPOS PARA EL OBJETO REQUEST
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

//VER LAS ACCIONES QUE REALIZA EL USUARIO
app.use(logger('dev'))


//OBTENER LA IP DEL CLIENTE AL REALIZAR ALGUNA ACCIÓN
app.use(async (__, _, next: NextFunction) => {
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
        console.log(error)
        next()
    }
});

/* ----- DEFINIR RUTA DEL USUARIO ---- */

// Crear una instancia del enrutador de usuario
app.use('/suma/api/usuarios', _UsuarioRouter);

//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', _PerfilesRouter)

//DEFINIR RUTA DE LOS MODULOS
app.use('/suma/api/modulos', _ModulosRouter)

//DEFINIR RUTA DE LOS ROLES
app.use('/suma/api/roles', _RolesRouter)

//DEFINIR RUTA DE LOS MENUS
app.use('/suma/api/menus', _MenusRouter)

//DEFINIR RUTA DE LOS EMPRESAS
app.use('/suma/api/empresas', _EmpresasRouter)

//DEFINIR RUTAS PARA LAS OPCIONES BASICAS
app.use('/suma/api/opciones-basicas', _OpcionesBasicasRouter)

//DEFINIR RUTAS PARA LOS PRODUCTOS
app.use('/suma/api/opciones-basicas', _ProductosRouter)

//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res: Response) => {
    res.status(405).send({ error: true, message: "No se ha encontrado la request" });
})

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

export default app;