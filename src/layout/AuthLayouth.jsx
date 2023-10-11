import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AuthLayouth = () => {
    const { authUsuario } = useAuth()

    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default AuthLayouth