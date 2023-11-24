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
import useProveedores from "../../../hooks/Compras/useProveedores";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AgregarProv = () => {
  const {
    proveedorAgg,
    guardar_proveedores,
    tipoDocAgg,
    obtener_tipo_documento,
    setProveedorAgg,
    obtener_tipo_producto,
    tipoProdEdit,
    tipoProdAgg,
  } = useProveedores();

  const { authUsuario, setAlerta } = useAuth();

  const [tipoProdSeleccionados, setTipoProdSeleccionados] = useState([]);

  useEffect(() => {
    obtener_tipo_documento();
    obtener_tipo_producto(tipoProdSeleccionados);
  }, []);

  const btn_cambio = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setProveedorAgg({
      ...proveedorAgg,
      [name]: name === "documento" ? value.replace(/\D/g, "") : value,
    });

    if (name === "id_tipo_documento") {
      // Aquí puedes realizar alguna acción adicional si es necesario.
    }

    if (name === "documento") {
      if (!/^\d*$/.test(value)) {
        setAlerta({
          error: true,
          show: true,
          message: "El documento debe contener solo dígitos",
        });
        setTimeout(() => setAlerta({}), 1500);
        return;
      }
    }
  };

  const navigate = useNavigate();

  const guardar_prov = async () => {
    const errors = {};

    try {
      const formData = {
        id_tercero: proveedorAgg.id_tercero,
        id_empresa: authUsuario.id_empresa,
        id_tipo_documento: proveedorAgg.id_tipo_documento,
        id_tipo_tercero: proveedorAgg.id_tipo_tercero,
        documento: proveedorAgg.documento,
        nombre: proveedorAgg.nombre,
        direccion: proveedorAgg.direccion,
        telefono: proveedorAgg.telefono,
        correo: proveedorAgg.correo,
        contacto: proveedorAgg.contacto,
        telefono_contacto: proveedorAgg.telefono_contacto,
        id_estado: proveedorAgg.id_estado,
        suministros: tipoProdSeleccionados,
      };
      if (
        tipoProdSeleccionados.length === 0 ||
        tipoProdSeleccionados.filter((tipoprod) => tipoprod?.id_estado === 1)
          .length === 0
      ) {
        setAlerta({
          error: true,
          show: true,
          message: "Debes seleccionar al menos un suministro",
        });
        return;
      }

      let esExito;
      esExito = await guardar_proveedores(formData);

      if (esExito) {
        navigate("/compras/proveedores");
      }
      console.log(proveedorAgg);
    } catch (error) {
      return;
    }
  };

  const chk_tipo_prod = (idTipoProd) => {
    const tipoprod_id = idTipoProd;

    if (
      tipoProdSeleccionados.find(
        (tipoprod) => tipoprod.id_tipo_producto == tipoprod_id
      )
    ) {
      if (
        tipoProdEdit.find(
          (tipoprod) => tipoprod.id_tipo_producto == tipoprod_id
        )
      ) {
        const [tipoprod] = tipoProdSeleccionados.filter(
          (tipoprod) => tipoprod.id_tipo_producto == tipoprod_id
        );
        if (tipoprod.id_estado == 1) {
          tipoprod.id_estado = 2;
        } else {
          tipoprod.id_estado = 1;
        }
        const tipoprodActualizados = tipoProdSeleccionados.map(
          (tipoProdState) =>
            tipoProdState.id_tipo_producto == tipoprod.id_tipo_producto
              ? tipoprod
              : tipoProdState
        );
        setTipoProdSeleccionados(tipoprodActualizados);
      } else {
        const tipoprod = tipoProdSeleccionados.filter(
          (tipoprod) => tipoprod.id_tipo_producto !== tipoprod_id
        );
        setTipoProdSeleccionados(tipoprod);
      }
    } else {
      setTipoProdSeleccionados([
        ...tipoProdSeleccionados,
        { id_tipo_producto: tipoprod_id, id_estado: 1 },
      ]);
    }
  };
  useEffect(() => {
    console.log("tipoProdSeleccionados actualizado:", tipoProdSeleccionados);
  }, [tipoProdSeleccionados]);

  const chk_tipoprod_seleccionado = (row) => {
    const tipoprod = tipoProdSeleccionados.filter(
      (tipoprod) => tipoprod.id_tipo_producto === row.id_tipo_producto
    );
    if (tipoprod) {
      return tipoprod[0]?.id_estado === 1; // Cambio aquí
    } else {
      return false;
    }
  };

  const main = () => (
    <>
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
          <div className="sm:px-4 md:px-8 lg:px-40 grid grid-cols-2 gap-4">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Tipo de Documento{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center">
                <Dropdown
                  value={proveedorAgg.id_tipo_documento}
                  onChange={btn_cambio}
                  options={tipoDocAgg}
                  name="id_tipo_documento"
                  optionLabel="tipo_doc"
                  optionValue="id_tipo_doc"
                  placeholder="Selecciona tipo de documento"
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
                  value={proveedorAgg?.documento}
                  onChange={btn_cambio}
                  name="documento"
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
                  value={proveedorAgg.nombre}
                  onChange={btn_cambio}
                  name="nombre"
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
                  value={proveedorAgg.correo}
                  onChange={btn_cambio}
                  name="correo"
                  type="email"
                  className="h-10 px-2"
                />
              </div>
            </div>
          </div>
          <div className="sm:px-4 md:px-8 lg:px-40 mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Direccion <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  value={proveedorAgg.direccion}
                  onChange={btn_cambio}
                  name="direccion"
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
                  value={proveedorAgg.telefono}
                  onChange={btn_cambio}
                  name="telefono"
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
                  value={proveedorAgg.contacto}
                  onChange={btn_cambio}
                  name="contacto"
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
                  value={proveedorAgg.telefono_contacto}
                  onChange={btn_cambio}
                  name="telefono_contacto"
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div
              hidden
              className="flex flex-col max-sm:col-span-2 max-lg:col-span-2"
            >
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
          <div className="pl-2 pt-3 mt-3 sm:px-4 md:px-8 lg:px-40">
            <h1>Suministros</h1>
            <div className="sm:px-4 md:px-8 lg:px-40 grid-cols-1 sm:grid-cols-2 gap-4 p-2 mt-2 rounded-md overflow-auto">
              {tipoProdAgg.map((tipoprod) => (
                <div key={tipoprod.id}>
                  <label
                    className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${
                      chk_tipoprod_seleccionado(tipoprod)
                        ? "bg-primaryYellow"
                        : "bg-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={chk_tipoprod_seleccionado(tipoprod)}
                      className="sr-only peer"
                      onChange={() =>
                        chk_tipo_prod(
                          tipoprod.id_tipo_producto,
                          tipoprod.id_tipo_producto
                        )
                      }
                    />
                    <span
                      className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}
                    ></span>
                  </label>
                  <span className="ml-6">{tipoprod.descripcion}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex sm:px-4 md:px-8 lg:px-40 mt-4 justify-content-end w-full">
            <Button tipo={"PRINCIPAL"} funcion={guardar_prov}>
              <div className="mx-2">Guardar Proveedor</div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return <>{main()}</>;
};

export default AgregarProv;
