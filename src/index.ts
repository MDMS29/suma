import app from './config/server';
import { Response } from 'express';

import * as _routes from './routes/App.Routes'

app.use('/suma/api/usuarios', _routes._UsuarioRouter)

//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', _routes._PerfilesRouter)

//DEFINIR RUTA DE LOS MÓDULOS
app.use('/suma/api/modulos', _routes._ModulosRouter)

//DEFINIR RUTA DE LOS ROLES
app.use('/suma/api/roles', _routes._RolesRouter)

//DEFINIR RUTA DE LOS MENUS
app.use('/suma/api/menus', _routes._MenusRouter)

//DEFINIR RUTA DE LAS EMPRESAS
app.use('/suma/api/empresas', _routes._EmpresasRouter)

//DEFINIR RUTAS PARA LAS OPCIONES BASICAS
app.use('/suma/api/opciones-basicas', _routes._OpcionesBasicasRouter)

//DEFINIR RUTAS PARA LOS PRODUCTOS
app.use('/suma/api/opciones-basicas/productos-empresa', _routes._ProductosRouter)

//DEFINIR RUTAS PARA LAS REQUISICIONES
app.use('/suma/api/compras', _routes._RequisicionesRouter)

//DEFINIR RUTAS PARA LOS PROVEEDORES
app.use('/suma/api/compras/proveedores', _routes._ProveedoresRouter)

//DEFINIR RUTAS PARA LAS AUDITORIAS
app.use('/suma/api/auditorias', _routes._HistorialRouter)

// DEFINIR RUTAS PARA LAS ORDENES
app.use('/suma/api/ordenes', _routes._OrdenesRouter)

//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res: Response) => {
    res.status(405).send({ error: true, message: "No se ha encontrado la request" });
})
