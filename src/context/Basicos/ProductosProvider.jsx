import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
// import useFamiliaProd from "../../hooks/Basicos/useFamiliaProd";
// import useMarcas from "../../hooks/Basicos/useMarcas";


const ProductosContext = createContext();

const ProductosProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const { setAlerta, setVerEliminarRestaurar, authUsuario, setAuthUsuario } = useAuth()
    // const [dataFliaPro] = useFamiliaProd()
    // const [dataMarcas] = useMarcas()

    const [permisosProductos, setPermisosProductos] = useState([])
    const [dataProductos, setDataProductos] = useState([])
    const [productoState, setProductoState] = useState({});

    const [productosAgg, setProductosAgg] = useState({

    })
    const [errors, setErrors] = useState({
        referencia: "",
        marca: "",
        familia: "",
        nombre_producto: "",
        unidad: "",
        precio_costo: "",
        precio_venta: "",
        tipo_producto: "",
        critico: "",
        inventariable: "",
        compuesto: "",
        ficha: "",
        certificado: ""
    })

    useEffect(() => {
        if (location.pathname.includes('productos')) {

            const obtener_productos = async () => {
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
                        const { data } = await conexion_cliente(
                            `/opciones-basicas/productos-empresa?estado=${estado}&empresa=${authUsuario.id_empresa}`,
                            config
                        );
                        // console.log(data);
                        // data.map((e) => { data.compuesto == true ? e.compuesto = "si" : e.compuesto = "no" })
                        setDataProductos(data);
                    } catch (error) {
                        setDataProductos([]);
                    }
                }
            };
            obtener_productos();
        }
    }, [location.pathname]);

    const eliminar_restablecer_producto = async (id) => {
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
            const { data } = await conexion_cliente.delete(`/perfiles/${id}?estado=${estado}`, config)

            if (data?.error) {
                setAlerta({ error: true, show: true, message: data.message })
                setTimeout(() => setAlerta({}), 1500)
                return false
            }

            const productos_actualizados = dataProductos.filter((producto) => producto.id_producto !== id)
            setDataProductos(productos_actualizados)

            setAlerta({ error: false, show: true, message: data.message })
            setTimeout(() => setAlerta({}), 1500)
            setVerEliminarRestaurar(false)
            return true

        } catch (error) {
            setAlerta({ error: false, show: true, message: error.response.data.message })
            setTimeout(() => setAlerta({}), 1500)
            return false
        }
    }

    const obj = useMemo(() => ({
        permisosProductos,
        setPermisosProductos,
        dataProductos,
        setDataProductos,
        productoState,
        setProductoState,
        eliminar_restablecer_producto,
        errors, 
        setErrors,
        productosAgg, 
        setProductosAgg
    }));
    return (
        <ProductosContext.Provider
            value={obj}
        >      {children}
        </ProductosContext.Provider>
    )
}

export { ProductosProvider }
export default ProductosContext