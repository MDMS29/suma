import { useContext } from "react"
import ModulosContext from "../../context/Configuracion/ModulosProvider"


const useModulos = () => {
  return useContext(ModulosContext)
}

export default useModulos