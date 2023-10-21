import axios from 'axios'

const conexionCliente = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_LOCAL}/suma/api` 
})

export default conexionCliente