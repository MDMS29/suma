import { useContext } from 'react'
import ProcesosContext from '../../context/Basicos/ProcesosProvider'

const useProcesos = () => {
  return useContext (ProcesosContext)
}

export default useProcesos