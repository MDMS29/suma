/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import Button from "../../../Botones/Button";
import useModulos from "../../../../hooks/Configuracion/useModulos";

const ModalAgregarModulo = ({ visible, onClose, guardarModulo }) => {
  const {
    ModulosAgg,
    roles,
    errors,
    cambiar_modulos,
    setModulosAgg,
    setErrors,
    obtener_roles,
    rolesEdit,
    editar_modulo,
    guardar_modulos,
    textoBotonIcon,
    setTextoBotonIcon,
  } = useModulos();

  const [rolesporModulo, setrolesporModulo] = useState([
    { id_rol: 1, id_estado: 1 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [ventanaIcon, setVentanaIcon] = useState();
  const [iconos, setIconos] = useState([]);

  useEffect(() => {
    const selectIcons = async () => {
      const result = await fetch("/dataIcons.json");
      const json = await result.json();
      setIconos(json.icons);
    };
    selectIcons();
  }, []);

  const filteredData = iconos.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buscador = (event) => {
    setSearchTerm(event.target.value);
  };

  const toast = useRef(null);

  const cerrar_modal = () => {
    onClose();

    setModulosAgg({
      id_modulo: 0,
      cod_modulo: "",
      nombre_modulo: "",
      icono: "",
    });

    setrolesporModulo([]);
    setErrors({});
  };

  useEffect(() => {
    obtener_roles();
    if (ModulosAgg.id_modulo) {
      setrolesporModulo(rolesEdit);
    }
  }, [rolesEdit]);

  const prevencion_de_espacios = (e, fieldName) => {
    if (fieldName === "cod_modulo" && e.key === " ") {
      e.preventDefault();
    }
  };

  const btn_guardar = async () => {
    const errors = {};

    if (!ModulosAgg.cod_modulo) {
      errors.cod_modulo = "El código del módulo es obligatorio";
    }
    const nombreModuloRegex = /^[A-Za-z\s]*$/;

    if (!ModulosAgg.nombre_modulo) {
      errors.nombre_modulo = "El nombre del módulo es obligatorio";
    } else if (!nombreModuloRegex.test(ModulosAgg.nombre_modulo)) {
      errors.nombre_modulo =
        "El nombre del módulo no puede contener números ni caracteres especiales";
    }

    if (!ModulosAgg?.icono || !ModulosAgg?.icono.startsWith("pi-")) {
      errors.icono = "El icono del módulo es obligario";
    }

    if (rolesporModulo.length === 0) {
      errors.roles = "Debes seleccionar al menos un rol";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});

    try {
      const formData = {
        id_modulo: ModulosAgg.id_modulo,
        cod_modulo: ModulosAgg.cod_modulo,
        nombre_modulo: ModulosAgg.nombre_modulo,
        icono: ModulosAgg.icono,
        roles: rolesporModulo,
      };

      let response;
      if (ModulosAgg.id_modulo !== 0) {
        response = await editar_modulo(formData);
      } else {
        response = await guardar_modulos(formData);
      }

      if (response) {
        onClose();
        setModulosAgg({
          id_modulo: 0,
          cod_modulo: "",
          nombre_modulo: "",
          icono: "",
        });
        setrolesporModulo([]);
      }
    } catch (error) {
      console.error("Error al guardar el modulo:", error);
    }
  };

  const ChklRoles = (nombrePermiso, idRolModulo) => {
    if (rolesporModulo.find((permiso) => permiso.id_rol == idRolModulo)) {
      if (rolesEdit.find((permiso) => permiso.id_rol == idRolModulo)) {
        const [permiso] = rolesporModulo.filter(
          (permiso) => permiso.id_rol == idRolModulo
        );
        if (permiso.id_estado == 1) {
          permiso.id_estado = 2;
        } else {
          permiso.id_estado = 1;
        }
        const permisosActuliazados = rolesporModulo.map((permisoState) =>
          permisoState.id_rol == permiso.id_rol ? permiso : permisoState
        );
        setrolesporModulo(permisosActuliazados);
      } else {
        const permisos = rolesporModulo.filter(
          (permiso) => permiso.id_rol !== idRolModulo
        );
        setrolesporModulo(permisos);
      }
    } else {
      setrolesporModulo([
        ...rolesporModulo,
        { id_rol: idRolModulo, id_estado: 1 },
      ]);
    }
  };

  const fncChkPermiso = (row) => {
    const permiso = rolesporModulo.filter(
      (permiso) => permiso.id_rol === row.id_rol
    );
    if (permiso) {
      return permiso[0]?.id_estado == 1;
    } else {
      return false;
    }
  };

  const footerContent = (
    <div>
      <Button tipo={"PRINCIPAL"} funcion={btn_guardar}>
        {ModulosAgg.id_modulo !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  const seleccionar_icono = () => {
    setVentanaIcon(true);
    setTextoBotonIcon("Cambiar");
  };

  const manejar_opcion_modulos =(e)=>{
    cambiar_modulos(e)
    setVentanaIcon(false)
  }

  return (
    <Dialog
      header={
        ModulosAgg.id_modulo !== 0 ? (
          <h1>Editar Módulo</h1>
        ) : (
          <h1>Agregar Módulo</h1>
        )
      }
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2"
      footer={footerContent}
    >
      <div>
        <Toast ref={toast} />
        <div className="flex flex-col pt-3 flex-wrap sm:w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 pb-2 font-semibold">
                Código del Módulo
              </label>
              <InputText
                type="text"
                value={ModulosAgg.cod_modulo}
                name="cod_modulo"
                disabled={ModulosAgg.id_modulo !==0 && "disabled"}
                className={`border-1 h-10 rounded-md px-3 py-2 ${
                  errors.cod_modulo ? "border-red-500" : "border-gray-300"
                } ${ModulosAgg.id_modulo !== 0 && "bg-gray-200"}`}
                onChange={(e) => cambiar_modulos(e, "cod_modulo")}
                onKeyDown={(e) => prevencion_de_espacios(e, "cod_modulo")}
              />
              {errors.cod_modulo && (
                <div className="text-red-600 text-xs ">{errors.cod_modulo}</div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-2 font-semibold">
                Icono Modulo / Preview
              </label>

              <div className="flex items-center gap-2">
                <Button tipo={"CANCELAR"} funcion={seleccionar_icono}>
                  {textoBotonIcon}
                </Button>
                <i className={`pi ${ModulosAgg?.icono} mx-3`}></i>
              </div>
              <br />
              {ventanaIcon && (
                <div className="flex flex-col bg-white shadow-xl border rounded-md z-10 mt-20 mr-2 absolute h-48">
                  <input
                    type="text"
                    placeholder="Busca"
                    className="p-2 focus:outline-none rounded-md"
                    value={searchTerm}
                    onChange={buscador}
                  />
                  <hr />
                  <div
                    className={` ${
                      filteredData.length > 0
                        ? "grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3"
                        : "flex h-auto"
                    } p-2 overflow-auto`}
                  >
                    {Array.isArray(filteredData) && filteredData.length > 0 ? (
                      filteredData.map((icono) => (
                        <button
                          value={icono.name}
                          className={`pi ${
                            icono.name
                          } hover:bg-gray-100 border-2 w-8 h-8 rounded-md ${
                            icono.name == ModulosAgg.icono &&
                            "border-blue-400 bg-gray-200"
                          }`}
                          onClick={manejar_opcion_modulos}
                          name="icono"
                          key={icono.name}
                        ></button>
                      ))
                    ) : (
                      <p className="w-full">No hay iconos disponibles</p>
                    )}
                  </div>
                </div>
              )}

              {errors.icono && (
                <div className="text-red-600 text-xs">{errors.icono}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Nombre del Módulo
            </label>
            <InputText
              value={ModulosAgg.nombre_modulo}
              name="nombre_modulo"
              className={`border-1 h-10 rounded-md px-3 py-2 ${
                errors.nombre_modulo ? "border-red-500" : "border-gray-300"
              }`}
              onChange={(e) => cambiar_modulos(e)}
            />
            {errors.nombre_modulo && (
              <div className="text-red-600 text-xs ">
                {errors.nombre_modulo}
              </div>
            )}
          </div>
          <div className="pl-2 pt-3 mt-3 border rounded-md">
            <h1>Roles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 overflow-auto h-48 mt-2">
              {roles.map((rol) => (
                <div key={rol.id}>
                  <>
                    <label
                      className={`p-checkbox w-10 h-5 relative rounded-full ${
                        fncChkPermiso(rol) || rol.id_rol == 1
                          ? "bg-primaryYellow"
                          : "bg-gray-300"} ${rol.id_rol == 1 && "cursor-not-allowed"} `}
                    >
                      <input
                        type="checkbox"
                        checked={rol.id_rol == 1 ? true : fncChkPermiso(rol)}
                        className="sr-only peer"
                        onChange={() =>
                          ChklRoles(rol.id_rol, rol.id_rol)
                        }
                      />
                      <span
                        className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}
                      ></span>
                    </label>
                    <span className="ml-6">{rol.nombre}</span>
                  </>
                </div>
              ))}
            </div>
            {errors.roles && (
              <div className="ml-8 text-red-600 mt-2">{errors.roles}</div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAgregarModulo;
