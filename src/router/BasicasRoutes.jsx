import Centros from '../Pages/Centros/Centros'
import Perfiles from '../Pages/Perfiles/Perfiles'
import Procesos from '../Pages/Procesos/Procesos'
import Roles from '../Pages/Roles/Roles'
import Unidades from '../Pages/Unidades/Unidades'
import Usuario from '../Pages/Usuarios/Usuarios'

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