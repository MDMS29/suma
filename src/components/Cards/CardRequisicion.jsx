import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button as PButton } from "primereact/button";
import { Edit_Icono, Trash_Icono } from "../Icons/Iconos";
import { useNavigate } from "react-router";
import useRequisiciones from "../../hooks/Compras/useRequisiciones";

const CardRequisicion = ({ requisiciones }) => {

  const navigate = useNavigate()

  const {
    buscar_requisicion
  } = useRequisiciones();

  const {
    fecha_requisicion,
    nombre_estado,
    correo_responsable,
    centro_costo,
    requisicion,
    tipo_productos,
    comentarios,
    id_requisicion
  } = requisiciones;

  const estilos = {
    ANULADO:
      "inline-block bg-red-200 rounded px-3 py-1 text-sm font-semibold text-red-700 mr-2 mb-2",
    APROBADA:
      "inline-block bg-green-200 rounded px-3 py-1 text-sm font-semibold text-green-950 mr-2 mb-2",
    PENDIENTE:
      "inline-block bg-blue-200 rounded px-3 py-1 text-sm font-semibold text-blue-950 mr-2 mb-2",
  };

  const editar_requisicion = async (e, id_requisicion) => {
    e.preventDefault();
    navigate('/compras/requisiciones/agregar')
    await buscar_requisicion(id_requisicion);
    return
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md w-96">
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
          <PButton
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded p-mr-2  mx-1"
            onClick={e => editar_requisicion(e, id_requisicion)}
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
