import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
const MarcasContext = createContext();

const MarcasProvider = ({ children }) => {

    const location = useLocation()
    const { authUsuario } = useAuth()
    
    const [dataMarcas, setDataMarcas] = useState([])
    const [permisosMarcas, setPermisosMarcas] = useState([])

    const [marcasAgg, setMarcasAgg] = useState({
        id_marcas: "",
        marcas: ""
    })


    useEffect(() => {
        if (location.pathname.includes('marcas')) {
            const obtener_marcas = async () => {
                const token = localStorage.getItem('token')

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                if (authUsuario.id_empresa) {
                    try {
                        const { data } = await conexion_cliente(`/basicas_productos/marcas_productos/`, config)
                        setDataMarcas(data)
                    } catch (error) {
                        setDataMarcas([])
                    }
                }
            }
            obtener_marcas()
        }
    }, [location.pathname])

    const buscar_marca = async () => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente(`/basicas_productos/marcas_productos/${id_marca}`, config);

            if (data?.error) {
                return { error: true, message: data.message }
            }

            const { id_marca, marca } = data
            setMarcasAgg({
                id_marca,
                marca: marca
            })


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const obj = useMemo(() => ({
        buscar_marca,
        dataMarcas,
        marcasAgg,
        setMarcasAgg,
        permisosMarcas,
        setPermisosMarcas


    }));

    return (
        <MarcasContext.Provider
            value={obj}
        >      {children}
        </MarcasContext.Provider>
    )
}

export { MarcasProvider };
export default MarcasContext;