import Login from "../Pages/Login";
import ResetearContraseñaUsuario from "../Pages/Usuarios/ResetearContraseñaUsuario";
import Usuario from "../Pages/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/Usuarios/UsuariosInactivos";
import Perfiles from "../Pages/Perfiles"
import Modulos from "../Pages/Modulos/Modulos";
import ModulosInactivos from "../Pages/Modulos/ModulosInactivos";

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
    name: "Modulos",
    route: "configuracion/modulos",
    component: <Modulos />,
    key: 6
  },
  {
    name: "Modulos Inactivos",
    route: "configuracion/modulos/inactivos",
    component: <ModulosInactivos />,
    key: 7
  }
];

export default routesUsuario;
