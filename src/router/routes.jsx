import Home from "../Pages/Home";
import ErrorRoutes from "./ErrorRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ComercialRoutes from "./Comercial";
import BasicasRoutes from "./BasicasRoutes";

const rutas_usuario = [
  {
    name: "Home",
    route: "/home",
    component: <Home />,
    key: 8
  },
  ...AuthRoutes,
  ...AdminRoutes,
  ...ComercialRoutes,
  ...BasicasRoutes,
  ...ErrorRoutes
];

export default rutas_usuario;
