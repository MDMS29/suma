import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
const MarcasContext = createContext();

const MarcasProvider = ({ children }) => {

    const location = useLocation()
    const { authUsuario, setAlerta } = useAuth()

    const [dataMarcas, setDataMarcas] = useState([])
    const [permisosMarcas, setPermisosMarcas] = useState([])

    const [marcasAgg, setMarcasAgg] = useState({
        id_marcas: "",
        marcas: ""
    })

    const [errors, setErrors] = useState({
        marca: ''
    });

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

    const buscar_marca = async (id) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente(`/basicas_productos/marcas_productos/${id}`, config);

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

    const guardar_marca = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await conexion_cliente.post("/basicas_productos/marcas_productos", formData, config
            );
            setDataMarcas([...dataMarcas, response.data]);
            setAlerta({
                error: false,
                show: true,
                message: 'Marca creada con exito'
            })
            setMarcasAgg({
                id_marca: 0,
                marca: ""
            });
            setTimeout(() => setAlerta({}), 1500)
        } catch (error) {
            console.error("Error al guardar la información:", error);
            setAlerta({
                error: true,
                show: true,
                message: error.response.data.message
            })
            setTimeout(() => setAlerta({}), 1500)
            throw error; // Puedes lanzar una excepción en caso de error
        }
    }

    const editar_marca = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.patch(`/basicas_productos/marcas_productos/${formData.id_marca}`, formData, config);
            const marcas_actualizados = dataMarcas.map((marca) =>
                marca.id_marca === data.id_marca ? { id_marca: data.id_marca, marca: data.marca } : marca
            );
            setDataMarcas(marcas_actualizados);
            

            setAlerta({
                error: false,
                show: true,
                message: 'Marca editado con exito'
            })
            setTimeout(() => setAlerta({}), 1500)
            setMarcasAgg({
                id_marca: 0,
                marca: ""
            });
        } catch (error) {
            console.error("Error al guardar la información:", error);
            setAlerta({
                error: true,
                show: true,
                message: error
            })
            setTimeout(() => setAlerta({}), 1500)
            throw error; // Puedes lanzar una excepción en caso de error
        }
    }

    const obj = useMemo(() => ({
        buscar_marca,
        dataMarcas,
        marcasAgg,
        setMarcasAgg,
        permisosMarcas,
        setPermisosMarcas,
        errors,
        setErrors,
        guardar_marca,
        editar_marca


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