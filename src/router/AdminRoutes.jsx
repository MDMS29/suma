import Modulos from "../Pages/Modulos/Modulos";
import ModulosInactivos from "../Pages/Modulos/ModulosInactivos";
import Perfiles from "../Pages/Perfiles/Perfiles";
import PerfilesInactivos from "../Pages/Perfiles/PerfilesInactivos";
import Roles from "../Pages/Roles/Roles";
import RolesInactivos from "../Pages/Roles/RolesInactivos";
import ResetearContraseñaUsuario from "../Pages/Usuarios/ResetearContraseñaUsuario";
import Usuario from "../Pages/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/Usuarios/UsuariosInactivos";

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
