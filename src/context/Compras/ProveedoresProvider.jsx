import { createContext, useEffect, useMemo, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProveedoresContext = createContext();

const ProveedoresProvider = ({ children }) => {
    const navigate = useNavigate()

    const { setAlerta, authUsuario, setAuthUsuario, setVerEliminarRestaurar } = useAuth()
    const [permisosProveedor, setPermisosProveedor] = useState([])
    const [dataProveedores, setDataProveedores] = useState([])
    const [proveedorState, setProveedorState] = useState({})


    useEffect(() => {
        if (location.pathname.includes('proveedores')) {
            const obtener_proveedores = async () => {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const estado = location.pathname.includes("inactivos") ? 2 : 1;
                if (authUsuario.id_empresa) {
                    try {
                        const { data } = await conexion_cliente(`/compras/proveedores?estado=${estado}&empresa=${authUsuario.id_empresa}`, config);
                        if (data.error) {
                            setAlerta({
                                error: true,
                                show: true,
                                message: data.message
                            })
                        }
                        if (data.error == false) {
                            setDataProveedores([]);
                            return
                        }
                        setDataProveedores(data);
                    } catch (error) {
                        return setDataProveedores([]);
                    }
                }
            }
            obtener_proveedores()
        }
    }, [location.pathname])

    const eliminar_restablecer_proveedor = async (id) => {
        // console.log(id);
        const token = localStorage.getItem('token')
        if (!token) {
            setAuthUsuario({})
            navigate('/auth')
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const estado = location.pathname.includes("inactivos") ? 1 : 2;
            const { data } = await conexion_cliente.delete(`/compras/proveedores/${id}?estado=${estado}`, config)

            if (data?.error) {
                setAlerta({ error: true, show: true, message: data.message })
                setTimeout(() => setAlerta({}), 1500)
                return false
            }

            const proveedores_actualizados = dataProveedores.filter((proveedor) => proveedor.id_tercero !== id)
            setDataProveedores(proveedores_actualizados)

            setAlerta({ error: false, show: true, message: data.message })
            setTimeout(() => setAlerta({}), 1500)
            setVerEliminarRestaurar(false)
            return true

        } catch (error) {
            setAlerta({ error: false, show: true, message: error.data })
            setTimeout(() => setAlerta({}), 1500)
            return false
        }
    }

    const obj = useMemo(() => ({
        permisosProveedor,
        setPermisosProveedor,
        dataProveedores,
        setDataProveedores,
        proveedorState,
        setProveedorState,
        eliminar_restablecer_proveedor
    }))

    return (
        <ProveedoresContext.Provider
            value={obj}>
            {children}
        </ProveedoresContext.Provider>
    )
}

export { ProveedoresProvider }
export default ProveedoresContext