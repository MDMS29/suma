import { useContext } from "react"
import MarcasContext from "../../context/Basicos/MarcasProvider"

const useMarcas = () => {
    return useContext(MarcasContext)
}

export default useMarcas