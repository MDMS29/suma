import { useEffect } from "react";
import { useMemo, createContext } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const HistorialContext = createContext();
const HistorialProvider = ({ children }) => {
    const { setAlerta } = useAuth();
    const [dataHistorial, setDataHistorial] = useState([]);

    useEffect(() => {
        if (location.pathname.includes('roles')) {
            (async () => {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    const { data } = await conexion_cliente(`/auditorias/historial/log`, config);
                    if (data.error) {
                        setAlerta({
                            error: true,
                            show: true,
                            message: data.message
                        })
                    }
                    if (data.error == false) {
                        setDataHistorial([]);
                        return
                    }
                    setDataHistorial(data);
                    console.log(data);
                } catch (error) {
                    return setDataHistorial([]);
                }
            })()
        }
    }, [location.pathname])

    const obj = useMemo(() => ({
        dataHistorial,
        setDataHistorial
    }))
    return (
        <HistorialContext.Provider
            value={obj}>
            {children}
        </HistorialContext.Provider>
    )
}

export default HistorialProvider