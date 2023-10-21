import { useContext } from "react"
import ModulosContext from "../context/ModulosProvider"


const useModulos = () => {
  return useContext(ModulosContext)
}

export default useModulos