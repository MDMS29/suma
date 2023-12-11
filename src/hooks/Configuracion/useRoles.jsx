import { useContext } from "react";
import RolesContext from "../../context/Configuracion/RolesProvider";

const useRoles = () => {
  return useContext(RolesContext)
}

export default useRoles