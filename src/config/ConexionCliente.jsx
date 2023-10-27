import axios from 'axios'

const conexion_cliente = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/suma/api` 
})

export default conexion_cliente