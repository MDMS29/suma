import Login from "../Pages/Login";
import Usuario from "../Pages/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/UsuariosInactivos";

const routesUsuario = [
  {
    name: "Usuarios",
    route: "config/usuarios",
    component: <Usuario />,
    key: 1
  },
  {
    name: "Usuarios",
    route: "config/usuarios/inactivos",
    component: <UsuarioInactivos />,
    key: 2
  },
  {
    name: "Prueba",
    route: "prueba",
    component: <Login />,
    key: 3
  }
];

export default routesUsuario;
