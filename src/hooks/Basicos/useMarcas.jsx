import { useContext } from "react"
import MarcasContext from "../../context/MarcasProvider"

const useMarcas = () => {
    return useContext(MarcasContext)

}

export default useMarcas