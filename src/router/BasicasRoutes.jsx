import Marcas from '../Pages/Basicos/Marcas/Marcas'
import Centros from '../Pages/Basicos/Centros/Centros'
import Procesos from '../Pages/Basicos/Procesos/Procesos'
import Unidades from '../Pages/Basicos/Unidades/Unidades'
import FamiliaProd from '../Pages/Basicos/FamiliaProd/FamiliaProd'
import TipoProd from '../Pages/Basicos/TipoProd/TipoProd'

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
        name: "Familias de Productos",
        route: "/basicas/familias-productos",
        component: <FamiliaProd />,
        key: 18
    },
    {
        name: "Tipos de Productos",
        route: "/basicas/tipos-productos",
        component: <TipoProd />,
        key: 19
    }
]

export default BasicasRoutes