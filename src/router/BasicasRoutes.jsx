import Marcas from '../Pages/Basicos/Marcas/Marcas'
import Roles from '../Pages/Configuracion/Roles/Roles'
import ResetearContraseñaUsuario from '../Pages/Configuracion/Usuarios/ResetearContraseñaUsuario'
import Usuario from '../Pages/Configuracion/Usuarios/Usuarios'

const BasicasRoutes =[
    {
        name: "Centros",
        route: "/basicas/centros",
        component: <Usuario />,
        key: 14
    },
    {
        name: "Procesos",
        route: "/basicas/procesos",
        component: <Usuario />,
        key: 15
    },
    {
        name: "Unidades",
        route: "/basicas/unidades",
        component: <ResetearContraseñaUsuario />,
        key: 16
    },
    {
        name: "Marcas",
        route: "/basicas/marcas-productos",
        component: <Marcas />,
        key: 17
    },
    {
        name: "Familias",
        route: "/basicas/familias",
        component: <Roles />,
        key: 18
    },
    {
        name: "Tipos de Productos",
        route: "/basicas/tipos-productos",
        component: <Usuario />,
        key: 19
    }
]

export default BasicasRoutes