import Requisiciones from "../Pages/Comercial/Requisiciones/Requisiciones";
import AgregarReq from "../Pages/Comercial/Requisiciones/AgregarReq";
import ReqRevisadas from "../Pages/Comercial/Requisiciones/ReqRevisadas";
import ReqEliminadas from "../Pages/Comercial/Requisiciones/ReqEliminadas";

const ComprasRoutes = [
    {
        name: "Requisiciones",
        route: "/compras/requisiciones",
        component: <Requisiciones />,
        key: 10
    },
    {
        name: "Requisiciones Verificadas",
        route: "/compras/requisiciones/verificadas",
        component: <ReqRevisadas />,
        key: 11
    },
    {
        name: "Requisiciones Eliminadas",
        route: "/compras/requisiciones/inactivas",
        component: <ReqEliminadas />,
        key: 12
    },
    {
        name: "Agregar Requisiciones",
        route: "/compras/requisiciones/agregar",
        component: <AgregarReq />,
        key: 13
    }
];

export default ComprasRoutes;
