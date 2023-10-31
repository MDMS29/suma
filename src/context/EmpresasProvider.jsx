import { createContext, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import conexion_cliente from "../config/ConexionCliente";
const EmpresasContext = createContext();

const EmpresasProvider = ({ children }) => {
    const { authUsuario } = useAuth()
    const [dataEmpresas, setDataEmpresas] = useState([])
    
    const obtener_empresas = async () => {
        const token = localStorage.getItem('token')

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const estado = location.pathname.includes('inactivos') ? 2 : 1
        if (authUsuario.id_empresa) {
            try {
                const { data } = await conexion_cliente(`/empresas?estado=${estado}`, config)
                setDataEmpresas(data)
            } catch (error) {
                setDataEmpresas([])
            }
        }
    }

    const obj = useMemo(() => ({
        obtener_empresas,
        dataEmpresas, 
        setDataEmpresas
    }));

    return (
        <EmpresasContext.Provider
            value={obj}
        >      {children}
        </EmpresasContext.Provider>
    )
}

export { EmpresasProvider }
export default EmpresasContext