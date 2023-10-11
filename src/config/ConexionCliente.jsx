import axios from 'axios'

const conexionCliente = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/suma/api` 
})

export default conexionCliente