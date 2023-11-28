import { useContext } from "react"
import HistorialContext from "../../context/Auditorias/HistorialProvider"

const useHistorial = () => {
    return useContext(HistorialContext)
}

export default useHistorial


