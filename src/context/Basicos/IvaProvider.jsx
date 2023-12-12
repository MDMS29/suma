import { createContext, useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import conexion_cliente from "../../config/ConexionCliente";
import { TIPOS_ALERTAS } from "../../helpers/constantes.js"

const IvaContext = createContext();

const IvaProvider = ({ children }) => {
    const location = useLocation()
    const { authUsuario, setAlerta } = useAuth()
    const [dataIva, setDataIva] = useState([])
    const [ivaAgg, setIvaAgg] = useState({
        id_empresa: authUsuario.id_empresa,
        id_iva: 0,
        descripcion: "",
        porcentaje: 0
    })
    const [errors, setErrors] = useState({
        porcentaje: '',
        descripcion: ''
    });
    const [permisosIva, setPermisosIva] = useState([])

    const obtener_iva = async () => {
        const token = localStorage.getItem('token')

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        if (authUsuario.id_empresa) {
            try {
                const { data } = await conexion_cliente(`/opciones-basicas/ivas?empresa=${authUsuario.id_empresa} `, config)
                if (data.error) {
                    setAlerta({
                        error: TIPOS_ALERTAS.ERROR,
                        show: true,
                        message: data.message
                    })
                }
                if (data.error == false) {
                    setDataIva([]);
                    return
                }
                setDataIva(data)
            } catch (error) {
                return setDataIva([])
            }
        }
    }

    useEffect(() => {
        if (location.pathname.includes('iva')) {
            obtener_iva()
        }
    }, [location.pathname])

    const guardar_iva = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.post("/opciones-basicas/ivas", formData, config);
            if (data?.error) {
                setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message })
                setTimeout(() => setAlerta({}), 1500)
                return false
            }

            setDataIva((dataIva) => [data, ...dataIva]);
            setAlerta({
                error: TIPOS_ALERTAS.SUCCESS,
                show: true,
                message: 'IVA creado con exito'
            })
            setTimeout(() => setAlerta({}), 1500)
            return true

        } catch (error) {
            setAlerta({
                error: TIPOS_ALERTAS.ERROR,
                show: true,
                message: error.response.data?.message
            })
            setTimeout(() => setAlerta({}), 1500)
            return false
        }
    }

    const buscar_iva = async (id) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente(`/opciones-basicas/ivas/${id}`, config);

            if (data?.error) {
                setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message })
                setTimeout(() => setAlerta({}), 1500)
                return false
            }
            const { id_iva, descripcion, porcentaje } = data
            setIvaAgg({
                id_iva,
                id_empresa: authUsuario.id_empresa,
                descripcion: descripcion,
                porcentaje: porcentaje
            })

        } catch (error) {
            setAlerta({
                error: TIPOS_ALERTAS.ERROR,
                show: true,
                message: error.response.data.message
            })

            setTimeout(() => setAlerta({}), 1500)
        }
    }

    const editar_iva = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.patch(`/opciones-basicas/ivas/${formData.id_iva}`, formData, config);

            if (!data?.error) {
                const iva_actualizado = dataIva.map((iva) =>
                    iva.id_iva === data.id_iva ? data : iva
                );
                setDataIva(iva_actualizado);

                setAlerta({
                    error: TIPOS_ALERTAS.SUCCESS,
                    show: true,
                    message: 'IVA editado con exito'
                })
                setIvaAgg({
                    id_empresa: authUsuario.id_empresa,
                    id_iva: 0,
                    descripcion: "",
                    porcentaje: 0
                });
                setTimeout(() => setAlerta({}), 1500)
                return true
            }
            setAlerta({
                error: TIPOS_ALERTAS.ERROR,
                show: true,
                message: data.message
            })
            setTimeout(() => setAlerta({}), 1500)
            return false;

        } catch (error) {
            setAlerta({
                error: TIPOS_ALERTAS.ERROR,
                show: true,
                message: error.response.data.message

            })
            setTimeout(() => setAlerta({}), 1500)
            throw error;
        }
    }


    const obj = useMemo(() => ({
        obtener_iva,
        dataIva,
        setDataIva,
        permisosIva,
        setPermisosIva,
        ivaAgg,
        setIvaAgg,
        errors,
        setErrors,
        guardar_iva,
        buscar_iva,
        editar_iva
    }));

    return (
        <IvaContext.Provider
            value={obj}
        >      {children}
        </IvaContext.Provider>
    )
}

export { IvaProvider }
export default IvaContext