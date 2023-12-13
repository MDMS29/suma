import { useContext } from 'react'
import IvaContext from '../../context/Basicos/IvaProvider'

const useIva = () => {
    return useContext(IvaContext)
}

export default useIva