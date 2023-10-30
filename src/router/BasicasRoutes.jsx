import Marcas from '../Pages/Basicos/Marcas/Marcas'
import Roles from '../Pages/Configuracion/Roles/Roles'
import Usuario from '../Pages/Configuracion/Usuarios/Usuarios'
import Centros from '../Pages/Centros/Centros'
import Procesos from '../Pages/Procesos/Procesos'
import Unidades from '../Pages/Unidades/Unidades'

const BasicasRoutes =[
    {
        name: "Centros",
        route: "/basicas/centros",
        component: <Centros/>,
        key: 14
    },
    {
        name: "Procesos",
        route: "/basicas/procesos",
        component: <Procesos />,
        key: 15
    },
    {
        name: "Unidades",
        route: "/basicas/unidades-de-medida",
        component: <Unidades />,
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