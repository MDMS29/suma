
import { Button as PButton } from "primereact/button";
import {
  Edit_Icono,
  PDF_Icono,
  Restore_Icono,
  Trash_Icono,
  Lupa_Icono
} from "../Icons/Iconos";
import { useNavigate } from "react-router";
import useRequisiciones from "../../hooks/Compras/useRequisiciones";
import { IDS_PERMISOS } from "../../helpers/constantes.js"
import useAuth from "../../hooks/useAuth.jsx";



const CardRequisicion = ({ requisiciones, setModalVisible }) => {
  const { authUsuario } = useAuth();
  const navigate = useNavigate();

  const { buscar_requisicion, setRequiState, generar_pdf } = useRequisiciones();

  const {
    fecha_requisicion,
    nombre_estado,
    correo_responsable,
    centro_costo,
    requisicion,
    tipo_productos,
    comentarios,
    id_requisicion,
    id_estado,
  } = requisiciones;

  const { setVerEliminarRestaurar } = useAuth();

  const estilos = {
    INACTIVO:
      "bg-red-200 rounded px-3 py-1 text-sm font-semibold text-red-700 mr-2 mb-2",
    APROBADA:
      "bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
    PENDIENTE:
      "bg-blue-200 rounded px-3 py-1 text-sm font-semibold text-blue-950 mr-2 mb-2",
    VERIFICADA:
      "bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
  };

  const editar_requisicion = async (e, id_requisicion) => {
    e.preventDefault();
    navigate("/compras/requisiciones/agregar");
    await buscar_requisicion(id_requisicion);
    return;
  };

  const eliminar_requisicion = async (e, id_requisicion) => {
    setRequiState(id_requisicion);
    setVerEliminarRestaurar(true);
    return;
  };

  const revisar_req = async (e, id_requisicion) => {
    e.preventDefault();
    setModalVisible(true);
    await buscar_requisicion(id_requisicion);
  };

  return (
    <div className="w-96 bg-white flex flex-col justify-between px-3 py-4 rounded-lg transition-all hover:shadow-xl">
      <div className="flex justify-between ">
        <div className="flex flex-col justify-center">
          <p>{fecha_requisicion.split("T")[0]}</p>
          <p className="text-sm">{correo_responsable}</p>
          <p className="font-bold text-sm">{requisicion}</p>
        </div>
        <div className="flex flex-col justify-center">
          <p className={`${estilos[nombre_estado]}`}>{nombre_estado}</p>
          <p className="font-bold text-sm text-end">{centro_costo}</p>
          <p className="font-bold text-sm text-end">{tipo_productos}</p>
        </div>
      </div>
      <hr />
      <div>
        <p className="my-2 max-h-12 truncate">
          {comentarios}
        </p>
      </div>
      <div>
        {id_estado == 2 ? (
          <>
            <PButton
              tooltip="Restaurar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2  mx-1"
              onClick={(e) => eliminar_requisicion(e, id_requisicion)}
            >
              {Restore_Icono}
            </PButton>
          </>
        ) : id_estado == 6 ? (
          <>
            <PButton
              tooltip="Descargar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2  mx-1"
              onClick={(e) => generar_pdf({ id_requisicion, requisicion })}
            >
              {PDF_Icono}
            </PButton>
          </>
        ) : (
          <>
            {authUsuario.perfiles?.some((perfil) => perfil.id_perfil !== IDS_PERMISOS.PERFIL_GERENTE) &&
              <PButton
                tooltip="Editar"
                tooltipOptions={{ position: "top" }}
                className="p-button-rounded p-mr-2  mx-1"
                onClick={e => editar_requisicion(e, id_requisicion)}
              >
                {Edit_Icono}
              </PButton>
            }

            <PButton
              tooltip="Eliminar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2  mx-1"
              onClick={(e) => eliminar_requisicion(e, id_requisicion)}
            >
              {Trash_Icono}
            </PButton>

            {authUsuario.perfiles?.some((perfil) => perfil.id_perfil !== IDS_PERMISOS.PERFIL_GERENTE) &&
              <PButton
                tooltip="Revisar"
                tooltipOptions={{ position: "top" }}
                className="p-button-rounded p-mr-2  mx-1"
                onClick={e => revisar_req(e, requisiciones.id_requisicion)}
              >
                {Lupa_Icono}
              </PButton>
            }
          </>
        )}
      </div>
    </div>
  );
};

export default CardRequisicion;
