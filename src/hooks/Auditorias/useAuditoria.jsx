import { useContext } from "react"
import AuditoriaContext from "../../context/Auditorias/AuditoriaProvider"

const useAuditoria = () => {
    return useContext(AuditoriaContext)
}

export default useAuditoria


