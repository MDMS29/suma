import { useContext } from "react"
import TipoProdContext from "../../context/Basicos/TipoProdProvider"

const useTipoProd = () => {
    return useContext(TipoProdContext)

}

export default useTipoProd