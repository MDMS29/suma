import { useContext } from "react";
import PerfilesContext from "../context/PerfilesProvider";

const usePerfiles = () => {
    return useContext(PerfilesContext)
}

export default usePerfiles