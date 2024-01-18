import { UsuariosRouter } from './Configuracion/UsuarioRoutes';
import { PerfilesRouter } from './Configuracion/PerfilesRoutes';
import { ModulosRouter } from './Configuracion/ModulosRoutes';
import { RolesRouter } from './Configuracion/RolesRoutes';
import { MenusRouter } from './Configuracion/MenuRoutes';
import { EmpresasRouter } from './Configuracion/EmpresaRoutes';
import { ProductosRouter } from './Opciones_Basicas/ProductosRoute';
import { RequisicionesRouter } from './Compras/RequisicionesRoutes';
import { ProveedoresRouter } from './Compras/ProveedoresRoutes';
import { AuditoriaRouter } from './Auditoria/AuditoriaRoutes';
import { OrdenesRouter } from './Compras/OrdenesRoutes';
import { UnidadesMedidaRouter } from "./Opciones_Basicas/UnidadesMedidaRoutes";
import { TiposProductosRouter } from "./Opciones_Basicas/TiposProductosRoutes";
import { MarcasProductosRouter } from "./Opciones_Basicas/MarcasProductosRoutes";
import { FamiliasProductosRouter } from "./Opciones_Basicas/FamiliasProductosRoutes";
import { ProcesosEmpresaRouter } from "./Opciones_Basicas/ProcesosEmpresaRoutes";
import { CentrosEmpresaRouter } from "./Opciones_Basicas/CentrosEmpresaRoutes";
import { TiposOrdenesRouter } from "./Opciones_Basicas/TiposOrdenesRoutes";
import { ParametrizadosRouter } from "./Opciones_Basicas/ParametrizadosRoutes";
import { TiposMovimientosRouter } from './Opciones_Basicas/TipoMovimientosRoutes';
import { BodegasRouter } from './Opciones_Basicas/BodegasRoutes';
import { MovimientosAlmacenRouter } from './Inventario/MovimientosRoutes';


export const AppRoutes = [
    new UsuariosRouter().router,
    new PerfilesRouter().router,
    new RolesRouter().router,
    new ModulosRouter().router,
    new MenusRouter().router,
    new EmpresasRouter().router,
    new ProductosRouter().router,
    new UnidadesMedidaRouter().router,
    new TiposProductosRouter().router,
    new MarcasProductosRouter().router,
    new FamiliasProductosRouter().router,
    new ProcesosEmpresaRouter().router,
    new CentrosEmpresaRouter().router,
    new TiposOrdenesRouter().router,
    new ParametrizadosRouter().router,
    new OrdenesRouter().router,
    new ProveedoresRouter().router,
    new RequisicionesRouter().router,
    new AuditoriaRouter().router,
    new TiposMovimientosRouter().router,
    new BodegasRouter().router,
    new MovimientosAlmacenRouter().router
]