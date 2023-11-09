import Requisiciones from "../Pages/Comercial/Requisiciones/Requisiciones";
import ReqAprobadas from "../Pages/Comercial/Requisiciones/ReqAprobadas";
import ReqAnuladas from "../Pages/Comercial/Requisiciones/ReqAnuladas";
import AgregarReq from "../Pages/Comercial/Requisiciones/AgregarReq";

const ComprasRoutes = [
    {
        name: "Requisiciones",
        route: "/compras/requisiciones",
        component: <Requisiciones />,
        key: 10
    },
    {
        name: "Requisiciones Aprobadas",
        route: "/compras/requisiciones/aprobadas",
        component: <ReqAprobadas />,
        key: 11
    },
    {
        name: "Requisiciones Anuladas",
        route: "/compras/requisiciones/anuladas",
        component: <ReqAnuladas />,
        key: 12
    },
    {
        name: "Agregar Requisiciones",
        route: "/compras/requisiciones/agregar",
        component: <AgregarReq />,
        key: 13
    },
];

export default ComprasRoutes;
