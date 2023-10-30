import { useContext } from "react";
import UsuariosContext from "../../context/Configuracion/UsuariosProvider";

const useUsuarios = () => {
    return useContext(UsuariosContext)
}

export default useUsuarios