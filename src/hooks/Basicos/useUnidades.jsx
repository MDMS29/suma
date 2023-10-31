import { useContext } from "react"
import UnidadesContext from "../../context/Basicos/UnidadesProvider"


const useUnidades = () => {
  return useContext(UnidadesContext)
}

export default useUnidades