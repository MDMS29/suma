import { useContext } from 'react'
import ProductosContext from '../../context/Basicos/ProductosProvider'

const useProductos = () => {
    return useContext(ProductosContext)
}

export default useProductos