import React from "react";
import {
  Add_Icono,
  Proveedores_Icon,
  Return_Icono,
  Subir_Archi_Icon,
} from "../../../components/Icons/Iconos";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Button from "../../../components/Botones/Button";
import BLink from "../../../components/Botones/BLink";

const AgregarProv = () => {
  const main = () => ( 
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl ">
            <p>Agregar Proveedores</p>
          </h1>
          {Proveedores_Icon}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <Button tipo={"PRINCIPAL"} funcion={(e) => window.history.back()}>
          {Return_Icono} Regresar
        </Button>
          <div className="h-full flex justify-center items-center">
            <BLink tipo={"INACTIVOS"} url={"/compras/proveedores/inactivos"}>
              Inactivos
            </BLink>
          </div>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full">
          <div className="px-40 grid grid-cols-2 gap-4">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Tipo de Documento{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center">
                <Dropdown
                  //   value={RequiAgg.id_proceso}
                  //   onChange={(e) => btn_cambio(e)}
                  //   options={dataProcesos}
                  name="id_proceso"
                  optionLabel="proceso"
                  optionValue="id_proceso"
                  placeholder="Selecciona tipo de documento"
                  filter
                  className="md:w-14rem"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Numero de Documento{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Nombre Completo{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>

            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Correo Electrónico{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>
          </div>
          <div className="px-40 mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Direccion <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>

            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Telefono <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Nombre de Contacto{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Telefono de Contacto{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  //   value={RequiAgg.consecutivo}
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Documentos <span className="font-bold text-red-900">*</span>
              </label>
              <div className="flex justify-content-center w-full">
                <Button tipo={"DESCARGAR"}>
                  {Subir_Archi_Icon}
                  <div className="mx-2">Seleccionar Archivos</div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div> 
  );

  return <>{main()}</>;
};

export default AgregarProv;
