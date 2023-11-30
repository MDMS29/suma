import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { TIPOS_ALERTAS } from "../../helpers/constantes.js"

const ProcesosContext = createContext();

const ProcesosProvider = ({ children }) => {
    const location = useLocation()
    const { authUsuario, setAlerta } = useAuth()


    const [permisosProcesos, setPermisosProcesos] = useState([])
    const [dataProcesos, setDataProcesos] = useState([])

    const [procesosAgg, setProcesosAgg] = useState({
        id_empresa: authUsuario.id_empresa,
        id_proceso: 0,
        codigo: "",
        proceso: ""
    })

    const [errors, setErrors] = useState({
        proceso: ''
    });

    const obtener_procesos = async () => {
        const token = localStorage.getItem('token')

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        if (authUsuario.id_empresa) {
            try {
                const { data } = await conexion_cliente(`/opciones-basicas/procesos-empresa?empresa=${authUsuario.id_empresa} `, config)
                if (data.error == false) {
                    setDataProcesos([]);
                    return
                }
                setDataProcesos(data)
            } catch (error) {
                setDataProcesos([])
            }
        }
    }
    useEffect(() => {
        if (location.pathname.includes('procesos')) {
            obtener_procesos()
        }
    }, [location.pathname])

    const buscar_proceso = async (id) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente(`/opciones-basicas/procesos-empresa/${id}`, config);

            if (data?.error) {
                setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message })
                setTimeout(() => setAlerta({}), 1500)
                return false
            }

            const { id_proceso, codigo, proceso } = data
            setProcesosAgg({
                id_proceso,
                id_empresa: authUsuario.id_empresa,
                codigo: codigo,
                proceso: proceso
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

    const guardar_proceso = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.post("/opciones-basicas/procesos-empresa", formData, config);
            if (!data?.error) {
                setDataProcesos((dataProcesos) => [data, ...dataProcesos]);
                setAlerta({
                    error: TIPOS_ALERTAS.SUCCESS,
                    show: true,
                    message: 'Proceso creado con exito'
                })
                setProcesosAgg({
                    id_empresa: formData.id_empresa,
                    id_proceso: 0,
                    codigo: "",
                    proceso: ""
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
                message: error.data?.message
            })
            setTimeout(() => setAlerta({}), 1500)
            throw error;
        }
    }

    const editar_proceso = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.patch(`/opciones-basicas/procesos-empresa/${formData.id_proceso}`, formData, config);

            if (!data?.error) {
                const procesos_actualizados = dataProcesos.map((proceso) =>
                    proceso.id_proceso === data.id_proceso ? { id_proceso: data.id_proceso, codigo: data.codigo, proceso: data.proceso } : proceso
                );
                setDataProcesos(procesos_actualizados);

                setAlerta({
                    error: TIPOS_ALERTAS.SUCCESS,
                    show: true,
                    message: 'Proceso editado con exito'
                })
                setProcesosAgg({
                    id_empresa: authUsuario.id_empresa,
                    id_proceso: 0,
                    codigo: "",
                    proceso: ""
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
        errors,
        setErrors,
        permisosProcesos,
        setPermisosProcesos,
        dataProcesos,
        setDataProcesos,
        buscar_proceso,
        guardar_proceso,
        editar_proceso,
        procesosAgg,
        setProcesosAgg,
        obtener_procesos
    }));

    return (
        <ProcesosContext.Provider
            value={obj}
        >      {children}
        </ProcesosContext.Provider>
    )
}

export { ProcesosProvider };
export default ProcesosContext;