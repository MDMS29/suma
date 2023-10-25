import Perfiles from "../Pages/Perfiles/Perfiles";
import ResetearContraseñaUsuario from "../Pages/Usuarios/ResetearContraseñaUsuario";
import Usuario from "../Pages/Usuarios/Usuarios";
import UsuarioInactivos from "../Pages/Usuarios/UsuariosInactivos";

const ComercialRoutes = [
    {
        name: "Usuarios",
        route: "/comercial/requisiciones",
        component: <Usuario />,
        key: 10
    },
    {
        name: "Usuarios Inactivos",
        route: "/comercial/ordenes-de-compra",
        component: <UsuarioInactivos />,
        key: 11
    },
    {
        name: "Resetear Contraseña",
        route: "/comercial/ordenes-de-servicio",
        component: <ResetearContraseñaUsuario />,
        key: 12
    },
    {
        name: "Perfiles",
        route: "/comercial/ordenes-de-trabajo",
        component: <Perfiles />,
        key: 13
    },
];

export default ComercialRoutes;
