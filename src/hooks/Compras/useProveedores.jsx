import { useContext } from "react"
import RequisicionesContext from "../../context/Compras/ProveedoresProvider"

const useRequisiciones = () => {
    return useContext(RequisicionesContext)
}

export default useRequisiciones