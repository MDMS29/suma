import Home from "../Pages/Home";
import ErrorRoutes from "./ErrorRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

const rutas_usuario = [
  {
    name: "Home",
    route: "/home",
    component: <Home />,
    key: 8
  },
  ...AdminRoutes,
  ...AuthRoutes,
  ...ErrorRoutes
];

export default rutas_usuario;
