import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";


const ProductosContext = createContext();

const ProductosProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const { setAlerta, setVerEliminarRestaurar, authUsuario, setAuthUsuario } = useAuth()

    const [permisosProductos, setPermisosProductos] = useState([])
    const [dataProductos, setDataProductos] = useState([])
    const [productoState, setProductoState] = useState({});

    const [productosAgg, setProductosAgg] = useState({
        id_empresa: authUsuario.id_empresa,
        id_producto: 0,
        id_familia: 0,
        id_marca: 0,
        id_tipo_producto: 0,
        id_unidad: 0,
        referencia: 0,
        descripcion: "",
        foto: "",
        precio_costo: 0,
        precio_venta: 0,
        critico: false,
        inventariable: false,
        compuesto: false,
        ficha: false,
        certificado: false
    })

    const [errors, setErrors] = useState({
        referencia: "",
        marca: "",
        familia: "",
        descripcion: "",
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
                        if (data.error == false) {
                            setDataProductos([]);
                            return
                        }

                        setDataProductos(data);
                    } catch (error) {
                        setDataProductos([]);
                    }
                }
            };
            obtener_productos();
        }
    }, [location.pathname]);

    const guardar_producto = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data } = await conexion_cliente.post("/opciones-basicas/productos-empresa", formData, config);
            if (!data?.error) {
                setDataProductos([...dataProductos, data])
                setAlerta({
                    error: false,
                    show: true,
                    message: 'Producto creado con exito'
                })
                setTimeout(() => setAlerta({}), 1500)
                return true
            }
            setAlerta({
                error: true,
                show: true,
                message: data.message
            })
            setTimeout(() => setAlerta({}), 1500)
            return false;

        } catch (error) {
            setAlerta({
                error: true,
                show: true,
                message: error.response?.data.message
            })
            setTimeout(() => setAlerta({}), 1500)
        }
    }

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
            const { data } = await conexion_cliente.delete(`/opciones-basicas/productos-empresa/${id}?estado=${estado}`, config)

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
            setAlerta({ error: false, show: true, message: error.data })
            setTimeout(() => setAlerta({}), 1500)
            return false
        }
    }

    const buscar_producto = async (id) => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente(`/opciones-basicas/productos-empresa/${id}`, config);
            console.log(data);
            if (data?.error) {
                return { error: true, message: data.message }
            }
            const { id_producto,
                id_familia,
                id_marca,
                id_tipo_producto,
                id_unidad,
                referencia,
                descripcion,
                foto,
                precio_costo,
                precio_venta,
                critico,
                inventariable,
                compuesto,
                ficha,
                certificado } = data

            setProductosAgg({
                id_producto,
                id_familia,
                id_marca,
                id_tipo_producto,
                id_unidad,
                referencia: referencia,
                descripcion: descripcion,
                foto: foto,
                precio_costo: precio_costo,
                precio_venta: precio_venta,
                critico: critico,
                inventariable: inventariable,
                compuesto: compuesto,
                ficha: ficha,
                certificado: certificado
            })


        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const editar_producto = async (formData) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const { data } = await conexion_cliente.patch(`/opciones-basicas/productos-empresa/${formData.id_producto}`, formData, config);
            console.log(formData);
            if (!data?.error) {
                const productos_actualizados = dataProductos.map((producto) =>
                    producto.id_producto === data.id_producto
                        ? data
                        : producto
                );
                setDataProductos(productos_actualizados);

                setAlerta({
                    error: false,
                    show: true,
                    message: 'Producto editado con exito'
                })
                setProductosAgg({
                    id_empresa: authUsuario.id_empresa,
                    id_producto: 0,
                    id_familia: 0,
                    id_marca: 0,
                    id_tipo_producto: 0,
                    referencia: 0,
                    id_unidad: 0,
                    descripcion: "",
                    foto: "",
                    precio_costo: "",
                    precio_venta: "",
                    critico: false,
                    inventariable: false,
                    compuesto: false,
                    ficha: false,
                    certificado: false
                });
                setTimeout(() => setAlerta({}), 1500)
                return true
            }
            setAlerta({
                error: true,
                show: true,
                message: data.message
            })
            setTimeout(() => setAlerta({}), 1500)
            return false;

        } catch (error) {
            setAlerta({
                error: true,
                show: true,
                message: error.response.data.message
            })

            setTimeout(() => setAlerta({}), 1500)
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
        setProductosAgg,
        buscar_producto,
        guardar_producto,
        editar_producto
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