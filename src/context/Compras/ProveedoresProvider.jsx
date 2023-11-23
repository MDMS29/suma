import { createContext, useEffect, useMemo, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";

const ProveedoresContext = createContext();

const ProveedoresProvider = ({ children }) => {

    const { setAlerta, authUsuario } = useAuth()
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
                        console.log(data);
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

    const obj = useMemo(() => ({
        permisosProveedor,
        setPermisosProveedor,
        dataProveedores,
        setDataProveedores,
        proveedorState,
        setProveedorState
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