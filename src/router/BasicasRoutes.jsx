import Marcas from '../Pages/Basicos/Marcas/Marcas'
import Centros from '../Pages/Basicos/Centros/Centros'
import Procesos from '../Pages/Basicos/Procesos/Procesos'
import Unidades from '../Pages/Basicos/Unidades/Unidades'
import FamiliaProd from '../Pages/Basicos/FamiliaProd/FamiliaProd'
import TipoProd from '../Pages/Basicos/TipoProd/TipoProd'
import Productos from '../Pages/Basicos/Productos/Productos'
import ProductosInactivos from '../Pages/Basicos/Productos/ProductosInactivos'

const BasicasRoutes =[
    {
        name: "Centros",
        route: "/basicas/centros",
        component: <Centros/>,
        key: 15
    },
    {
        name: "Procesos",
        route: "/basicas/procesos",
        component: <Procesos />,
        key: 16
    },
    {
        name: "Unidades",
        route: "/basicas/unidades-de-medida",
        component: <Unidades />,
        key: 17
    },
    {
        name: "Marcas",
        route: "/basicas/marcas-productos",
        component: <Marcas />,
        key: 18
    },
    {
        name: "Familias de Productos",
        route: "/basicas/familias-productos",
        component: <FamiliaProd />,
        key: 19
    },
    {
        name: "Tipos de Productos",
        route: "/basicas/tipos-productos",
        component: <TipoProd />,
        key: 20
    },
    {
        name: "Productos",
        route: "/basicas/productos",
        component: <Productos />,
        key: 21
    },
    {
        name: "Productos Inactivos",
        route: "/basicas/productos/inactivos",
        component: <ProductosInactivos />,
        key: 22
    }
]

export default BasicasRoutes