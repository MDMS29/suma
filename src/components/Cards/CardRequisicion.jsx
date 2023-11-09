import React from "react";
import { Card } from "primereact/card";
import { Button as PButton } from "primereact/button";
import { Edit_Icono, Trash_Icono } from "../Icons/Iconos";

const CardRequisicion = ({ requisiciones }) => {
  const {
    fecha_requisicion,
    nombre_estado,
    correo_responsable,
    centro_costo,
    requisicion,
    tipo_productos,
    comentarios
  } = requisiciones;

  const estilos = {
    ANULADO: "inline-block bg-red-200 rounded px-3 py-1 text-sm font-semibold text-red-700 mr-2 mb-2",
    APROBADA: "inline-block bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
    PENDIENTE:"inline-block bg-blue-200 rounded px-3 py-1 text-sm font-semibold text-blue-950 mr-2 mb-2"
}

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg w-96">
      <Card className="md:w-25rem">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {fecha_requisicion.split("T")[0]}
          </div>
          <div>
            <span className={estilos[nombre_estado]}>{nombre_estado}</span>
          </div>
        </div>
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center">{correo_responsable}</div>
          <div className="font-bold">{centro_costo}</div>
        </div>
        <div className="flex justify-between items-center my-2">
          <div className="font-bold">{requisicion}</div>
          <div className="font-bold">{tipo_productos}</div>
        </div>
        <hr className="w-full" />
        <p className="my-2">{comentarios}</p>
        <div className="pt-4 pb-2">
          <PButton
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded p-mr-2  mx-1"
          >
            {Edit_Icono}
          </PButton>
          <PButton
            tooltip="Eliminar"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded p-mr-2  mx-1"
          >
            {Trash_Icono}
          </PButton>
        </div>
      </Card>
    </div>
  );
};

export default CardRequisicion;
