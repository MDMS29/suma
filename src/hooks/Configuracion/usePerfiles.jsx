import { useContext } from "react";
import PerfilesContext from "../../context/Configuracion/PerfilesProvider";

const usePerfiles = () => {
    return useContext(PerfilesContext)
}

export default usePerfiles