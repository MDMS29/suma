import Sidebar from "../components/Sidebar"
import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Layout = () => {
    const { authUsuario } = useAuth()
    let variablePagina = 0

    const funcionModal = () => {
        if (authUsuario.id_usuario && authUsuario.cm_clave) {
            variablePagina = 1
        } if (authUsuario.id_usuario) {
            variablePagina = 2
        } if (authUsuario.id_usuario && !authUsuario.cm_clave) {
            variablePagina = 3
        }
    }
    funcionModal()

    let bloqueLayout = (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex justify-center flex-1 md:h-screen overflow-y-scroll">
                <Outlet />
            </main>
        </div>
    )

    const switchPagina = () => {
        let contentPagina = ""

        switch (variablePagina) {
            case 2:
                contentPagina = <Navigate to="/auth/resetear" />;
                break;

            case 3:
                contentPagina = bloqueLayout
                break;

            default:
                contentPagina = bloqueLayout
                break;
        }
        return contentPagina
    }

    return (
        <>
            {switchPagina()}
        </>
    )
}

export default Layout