import { Card } from "primereact/card";
import { Button as PButton } from "primereact/button";
import { Edit_Icono, PDF_Icono, Restore_Icono, Trash_Icono } from "../Icons/Iconos";
import { useNavigate } from "react-router";
import useRequisiciones from "../../hooks/Compras/useRequisiciones";
import { IDS_PERMISOS } from "../../helpers/constantes.js"
import useAuth from "../../hooks/useAuth.jsx";



const CardRequisicion = ({ requisiciones }) => {
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
      "inline-block bg-red-200 rounded px-3 py-1 text-sm font-semibold text-red-700 mr-2 mb-2",
    APROBADA:
      "inline-block bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
    PENDIENTE:
      "inline-block bg-blue-200 rounded px-3 py-1 text-sm font-semibold text-blue-950 mr-2 mb-2",
    VERIFICADA:
      "inline-block bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
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

  return (
    <div className="max-w-sm rounded-lg bg-white overflow-hidden w-96">
      <Card className="md:w-25rem rounded-lg h-60">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            {fecha_requisicion.split("T")[0]}
          </div>
          <div>
            <span className={estilos[nombre_estado]}>{nombre_estado}</span>
          </div>
        </div>
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center text-sm">{correo_responsable}</div>
          <div className="font-bold text-sm">{centro_costo}</div>
        </div>
        <div className="flex justify-between items-center my-2">
          <div className="font-bold text-sm">{requisicion}</div>
          <div className="font-bold text-sm">{tipo_productos}</div>
        </div>
        <hr className="w-full" />
        <p className="my-2">{comentarios}</p>
        <div className="pt-4 pb-2">
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
                onClick={(e) => generar_pdf(id_requisicion)}
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
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CardRequisicion;
