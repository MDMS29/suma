import Requisiciones from "../Pages/Comercial/Requisiciones/Requisiciones";
import AgregarReq from "../Pages/Comercial/Requisiciones/AgregarReq";
import ReqRevisadas from "../Pages/Comercial/Requisiciones/ReqRevisadas";
import ReqEliminadas from "../Pages/Comercial/Requisiciones/ReqEliminadas";
import Proveedores from "../Pages/Comercial/Proveedores/Proveedores";
import AgregarProv from "../Pages/Comercial/Proveedores/AgregarProv";

const ComprasRoutes = [
  {
    name: "Requisiciones",
    route: "/compras/requisiciones",
    component: <Requisiciones />,
    key: 10,
  },
  {
    name: "Requisiciones Verificadas",
    route: "/compras/requisiciones/verificadas",
    component: <ReqRevisadas />,
    key: 11,
  },
  {
    name: "Requisiciones Eliminadas",
    route: "/compras/requisiciones/inactivas",
    component: <ReqEliminadas />,
    key: 12,
  },
  {
    name: "Agregar Requisiciones",
    route: "/compras/requisiciones/agregar",
    component: <AgregarReq />,
    key: 13,
  },
  {
    name: "Proveedores",
    route: "/compras/proveedores",
    component: <Proveedores />,
    key: 14,
  },
  {
    name: "Agregar Proveedores",
    route: "/compras/proveedores/agregar",
    component: <AgregarProv />,
    key: 15,
  },
];

export default ComprasRoutes;
