import { useContext } from "react"
import FamiliaProdContext from "../../context/Basicos/FamiliaProdProvider"

const useFamiliaProd = () => {
    return useContext(FamiliaProdContext)

}

export default useFamiliaProd