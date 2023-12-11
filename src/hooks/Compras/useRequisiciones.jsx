import { useContext } from "react"
import RequisicionesContext from "../../context/Compras/RequisicionesProvider"

const useRequisiciones = () => {
    return useContext(RequisicionesContext)
} 

export default useRequisiciones