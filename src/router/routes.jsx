import Home from "../Pages/Home";
import ErrorRoutes from "./ErrorRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ComercialRoutes from "./Comercial";

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
  ...ErrorRoutes
];

export default rutas_usuario;
