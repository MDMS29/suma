import { useContext } from "react"
import CentrosContext from "../../context/Basicos/CentrosProvider"

const useCentros = () => {
  return useContext(CentrosContext)
}

export default useCentros