import { useContext } from "react";
import TipoOrdenContext from "../../context/Basicos/TipoOrdenProvider";

const useTipoOrden = () => {
  return useContext(TipoOrdenContext);
};

export default useTipoOrden;
