import {
  Proveedores_Icon,
  Return_Icono,
  Subir_Archi_Icon,
} from "../../../components/Icons/Iconos";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Button from "../../../components/Botones/Button";
import useProveedores from "../../../hooks/Compras/useProveedores";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IDS_PERMISOS } from "../../../helpers/constantes.js";

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
    editar_proveedores,
    tipoProdSeleccionados,
    setTipoProdSeleccionados,
  } = useProveedores();

  const { setAlerta, authUsuario } = useAuth();

  useEffect(() => {
    obtener_tipo_documento();
    obtener_tipo_producto(tipoProdSeleccionados);
  }, []);

  const btn_cambio = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (
      name === "documento" ||
      name === "telefono" ||
      name === "telefono_contacto"
    ) {
      setProveedorAgg({
        ...proveedorAgg,
        [name]: value.replace(/\D/g, ""),
      });
    } else {
      setProveedorAgg({
        ...proveedorAgg,
        [name]: value,
      });
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
    if (name === "telefono") {
      if (!/^\d*$/.test(value)) {
        setAlerta({
          error: true,
          show: true,
          message: "El teléfono debe contener solo dígitos",
        });
        setTimeout(() => setAlerta({}), 1500);
        return;
      }
    }
    if (name === "telefono_contacto") {
      if (!/^\d*$/.test(value)) {
        setAlerta({
          error: true,
          show: true,
          message: "El teléfono de contacto debe contener solo dígitos",
        });
        setTimeout(() => setAlerta({}), 1500);
        return;
      }
    }
  };

  const navigate = useNavigate();

  const guardar_prov = async () => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

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
    if (proveedorAgg.id_tipo_documento == 0) {
      setAlerta({
        error: true,
        show: true,
        message: "El tipo de documento es obligatorio",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (proveedorAgg.documento == "") {
      setAlerta({
        error: true,
        show: true,
        message: "El documento es obligatorio",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (proveedorAgg.nombre == "") {
      setAlerta({
        error: true,
        show: true,
        message: "El nombre completo es obligatorio",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (proveedorAgg.correo == "") {
      setAlerta({
        error: true,
        show: true,
        message: "El correo electronico es obligatorio",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (!emailPattern.test(proveedorAgg.correo)) {
      setAlerta({
        error: true,
        show: true,
        message: "El correo electronico no es valido",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (proveedorAgg.direccion == "") {
      setAlerta({
        error: true,
        show: true,
        message: "La dirección es obligatoria",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
    if (proveedorAgg.telefono == "") {
      setAlerta({
        error: true,
        show: true,
        message: "El teléfono es obligatorio",
      });
      setTimeout(() => setAlerta({}));
      return;
    }
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
    try {
      let esExito;
      if (proveedorAgg.id_tercero !== 0) {
        esExito = await editar_proveedores(formData);
      } else {
        esExito = await guardar_proveedores(formData);
      }

      if (esExito) {
        navigate("/compras/proveedores");
        limpiar_campos();
      }
    } catch (error) {
      return;
    }
  };

  const limpiar_campos = () => {
    setProveedorAgg({
      id_tercero: 0,
      id_tipo_tercero: 2,
      id_tipo_documento: 0,
      documento: "",
      nombre: "",
      direccion: "",
      telefono: "",
      correo: "",
      contacto: "",
      telefono_contacto: "",
      id_estado: 1,
    });
    setTipoProdSeleccionados([]);
  };

  const regresar = () => {
    navigate("/compras/proveedores");
    limpiar_campos();
  };

  const chk_tipo_prod = (idTipoProd) => {
    const tipoprod_id = idTipoProd;

    if (
      tipoProdSeleccionados.find(
        (tipoprod) => tipoprod.id_tipo_producto == tipoprod_id
      )
    ) {
      if (
        proveedorAgg.suministros.find(
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
        {
          id_tipo_producto: tipoprod_id,
          id_estado: 1,
        },
      ]);
    }
  };

  useEffect(() => {
    if (proveedorAgg.id_tercero) {
      setTipoProdSeleccionados(tipoProdEdit);
    }
  }, [tipoProdEdit]);

  const chk_tipoprod_seleccionado = (row) => {
    const tipoprod = tipoProdSeleccionados.filter(
      (tipoprod) => tipoprod.id_tipo_producto === row.id_tipo_producto
    );
    if (tipoprod) {
      return tipoprod[0]?.id_estado === 1;
    } else {
      return false;
    }
  };

  const main = () => (
    <div className="w-5/6">
      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl ">
          {proveedorAgg?.id_tercero == 0 ? (
            "Agregar Proveedor"
          ) : (
            <p>
              Editar Proveedor{" "}
              <span className="font-sans font-semibold">
                {" "}
                {proveedorAgg.nombre}
              </span>
            </p>
          )}
        </h1>
        {Proveedores_Icon}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <Button tipo={"PRINCIPAL"} funcion={(e) => regresar()}>
          {Return_Icono} Regresar
        </Button>
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
              Nombre/Razón Social{" "}
              <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center w-full">
              <InputText
                value={proveedorAgg.nombre}
                onChange={btn_cambio}
                maxLength={100}
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
                value={proveedorAgg?.telefono}
                onChange={btn_cambio}
                name="telefono"
                maxLength={10}
                className="h-10 px-2"
              />
            </div>
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Nombre de Contacto
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
              Telefono de Contacto
            </label>
            <div className="card flex justify-content-center w-full">
              <InputText
                value={proveedorAgg.telefono_contacto}
                onChange={btn_cambio}
                maxLength={10}
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
                  className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_tipoprod_seleccionado(tipoprod)
                      ? "bg-primaryYellow"
                      : "bg-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={chk_tipoprod_seleccionado(tipoprod)}
                    className="sr-only peer"
                    onChange={() => chk_tipo_prod(tipoprod.id_tipo_producto)}
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
            {proveedorAgg.id_tercero !== 0 ? "Actualizar" : "Guardar"}
          </Button>
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
                  disabled={
                    proveedorAgg.id_tercero !== 0 &&
                    authUsuario.perfiles?.some(
                      (perfil) =>
                        perfil.id_perfil !== IDS_PERMISOS.PERFIL_ADMINISTRADOR
                    )
                      ? true
                      : false
                  }
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
                  disabled={
                    proveedorAgg.id_tercero !== 0 &&
                    authUsuario.perfiles?.some(
                      (perfil) =>
                        perfil.id_perfil !== IDS_PERMISOS.PERFIL_ADMINISTRADOR
                    )
                      ? true
                      : false
                  }
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
                  maxLength={100}
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
                  value={proveedorAgg?.telefono}
                  onChange={btn_cambio}
                  name="telefono"
                  maxLength={10}
                  className="h-10 px-2"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Nombre de Contacto
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
                Telefono de Contacto
              </label>
              <div className="card flex justify-content-center w-full">
                <InputText
                  value={proveedorAgg.telefono_contacto}
                  onChange={btn_cambio}
                  maxLength={10}
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
                      onChange={() => chk_tipo_prod(tipoprod.id_tipo_producto)}
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
              {proveedorAgg.id_tercero !== 0 ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return <>{main()}</>;
};

export default AgregarProv;
