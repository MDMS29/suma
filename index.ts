import app from './config/server';
import { Response } from 'express';

import * as _routes from './src/routes/App.Routes'

app.use('/suma/api/usuarios', _routes._UsuarioRouter)

//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', _routes._PerfilesRouter)

//DEFINIR RUTA DE LOS MODULOS
app.use('/suma/api/modulos', _routes._ModulosRouter)

//DEFINIR RUTA DE LOS ROLES
app.use('/suma/api/roles', _routes._RolesRouter)

//DEFINIR RUTA DE LOS MENUS
app.use('/suma/api/menus', _routes._MenusRouter)

//DEFINIR RUTA DE LOS EMPRESAS
app.use('/suma/api/empresas', _routes._EmpresasRouter)

//DEFINIR RUTAS PARA LAS OPCIONES BASICAS
app.use('/suma/api/opciones-basicas', _routes._OpcionesBasicasRouter)

//DEFINIR RUTAS PARA LOS PRODUCTOS
app.use('/suma/api/opciones-basicas', _routes._ProductosRouter)

//DEFINIR RUTAS PARA LAS REQUISICIONES
app.use('/suma/api/compras', _routes._RequisicionesRouter)

//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res: Response) => {
    res.status(405).send({ error: true, message: "No se ha encontrado la request" });
})
