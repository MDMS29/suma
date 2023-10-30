import Modulos from "../Pages/Configuracion/Modulos/Modulos";
import ModulosInactivos from "../Pages/Configuracion/Modulos/ModulosInactivos";
import Perfiles from "../Pages/Configuracion/Perfiles/Perfiles";
import PerfilesInactivos from "../Pages/Configuracion/Perfiles/PerfilesInactivos";
import Roles from "../Pages/Configuracion/Roles/Roles";
import RolesInactivos from "../Pages/Configuracion/Roles/RolesInactivos";
import ResetearContraseñaUsuario from "../Pages/Configuracion/Usuarios/ResetearContraseñaUsuario";
import Usuario from "../Pages/Configuracion/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/Configuracion/Usuarios/UsuariosInactivos";

const AdminRoutes = [
    {
        name: "Usuarios",
        route: "/configuracion/usuarios",
        component: <Usuario />,
        key: 1
    },
    {
        name: "Usuarios Inactivos",
        route: "/configuracion/usuarios/inactivos",
        component: <UsuarioInactivos />,
        key: 2
    },
    {
        name: "Resetear Contraseña",
        route: "/auth/resetear",
        component: <ResetearContraseñaUsuario />,
        key: 3
    },
    {
        name: "Perfiles",
        route: "/configuracion/perfiles",
        component: <Perfiles />,
        key: 4
    },
    {
        name: "Perfiles Inactivos",
        route: "/configuracion/perfiles/inactivos",
        component: <PerfilesInactivos />,
        key: 5

    },
    {
        name: "Modulos",
        route: "/configuracion/modulos",
        component: <Modulos />,
        key: 6
    },
    {
        name: "Modulos Inactivos",
        route: "/configuracion/modulos/inactivos",
        component: <ModulosInactivos />,
        key: 7
    },
    {
        name: "Roles",
        route: "/configuracion/roles",
        component: <Roles />,
        key: 6
    },
    {
        name: "Roles Inactivos",
        route: "/configuracion/roles/inactivos",
        component: <RolesInactivos />,
        key: 7
    },
];

export default AdminRoutes;
