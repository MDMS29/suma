import Home from "../Pages/Home";
import ErrorRoutes from "./ErrorRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ComprasRoutes from "./ComprasRoutes";
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
  ...ComprasRoutes,
  ...BasicasRoutes,
  ...ErrorRoutes
];

export default rutas_usuario;
