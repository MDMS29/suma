import Perfiles from '../Pages/Perfiles/Perfiles'
import Roles from '../Pages/Roles/Roles'
import ResetearContraseñaUsuario from '../Pages/Usuarios/ResetearContraseñaUsuario'
import Usuario from '../Pages/Usuarios/Usuarios'

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
        route: "/basicas/marcas",
        component: <Perfiles />,
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