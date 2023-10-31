import { useContext } from "react"
import EmpresasContext from "../context/EmpresasProvider"

const useEmpresas = () => {
    return useContext(EmpresasContext)
}

export default useEmpresas