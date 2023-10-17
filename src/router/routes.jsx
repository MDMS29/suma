import Login from "../Pages/Login";
import ResetearContraseñaUsuario from "../Pages/Usuarios/ResetearContraseñaUsuario";
import Usuario from "../Pages/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/Usuarios/UsuariosInactivos";
import Perfiles from "../Pages/Perfiles/Perfiles"
import PerfilesInactivos from "../Pages/Perfiles/PerfilesInactivos";

const routesUsuario = [
  {
    name: "Usuarios",
    route: "configuracion/usuarios",
    component: <Usuario />,
    key: 1
  },
  {
    name: "Usuarios Inactivos",
    route: "configuracion/usuarios/inactivos",
    component: <UsuarioInactivos />,
    key: 2
  },
  {
    name: "Prueba",
    route: "prueba",
    component: <Login />,
    key: 3
  },
  {
    name: "Resetear Contraseña",
    route: "auth/resetear",
    component: <ResetearContraseñaUsuario />,
    key: 4
  },
  {
    name: "Perfiles",
    route: "configuracion/perfiles",
    component: <Perfiles />,
    key: 5
  },
  {
    name: "Perfiles Inactivos",
    route: "configuracion/perfiles/inactivos",
    component: <PerfilesInactivos />,
    key: 6
  }
];

export default routesUsuario;
