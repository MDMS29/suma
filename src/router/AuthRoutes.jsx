import Login from "../Pages/Login";
import ResetearContraseñaUsuario from "../Pages/Configuracion/Usuarios/ResetearContraseñaUsuario";

const AuthRoutes = [
    {
        name: "Resetear Contraseña",
        route: "/auth/resetear",
        component: <ResetearContraseñaUsuario />,
        key: 3
    },
    {
        name: "Login",
        route: "/auth",
        component: <Login />,
        key: 9
    },
];

export default AuthRoutes;
