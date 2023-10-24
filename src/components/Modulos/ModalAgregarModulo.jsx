/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import Button from "../Botones/Button";
import { InputText } from "primereact/inputtext";
import useModulos from "../../hooks/useModulos";
import { Toast } from "primereact/toast";

// eslint-disable-next-line react/prop-types
const ModalAgregarModulo = ({ visible, onClose, guardarModulo }) => {
  const {
    ModulosAgg,
    roles,
    errors,
    handleChangeModulos,
    setModulosAgg,
    setErrors,
    obtenerroles,
    rolesEdit,
    editarModulo,
    guardarModulos,
  } = useModulos();

  const [rolesporModulo, setrolesporModulo] = useState([]);

  const toast = useRef(null);

  const handleClose = () => {
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
    obtenerroles();
    if (ModulosAgg.id_modulo) {
      setrolesporModulo(rolesEdit);
    }
  }, [rolesEdit]);

  const handleSpacePrevention = (e, fieldName) => {
    if (fieldName === "cod_modulo" && e.key === " ") {
      e.preventDefault();
    }
  };

  const handleGuardar = async () => {
    const errors = {};

    const codModuloRegex = /^[0-9]*$/;
    if (!ModulosAgg.cod_modulo) {
      errors.cod_modulo = "El código del módulo es obligatorio";
    } else if (!codModuloRegex.test(ModulosAgg.cod_modulo)) {
      errors.cod_modulo = "El código del módulo debe contener solo dígitos";
    }
    const nombreModuloRegex = /^[A-Za-z\s]*$/;
    if (!ModulosAgg.nombre_modulo) {
      errors.nombre_modulo = "El nombre del módulo es obligatorio";
    } else if (!nombreModuloRegex.test(ModulosAgg.nombre_modulo)) {
      errors.nombre_modulo =
        "El nombre del módulo no puede contener números ni caracteres especiales";
    }

    if (!ModulosAgg.icono || !ModulosAgg.icono.startsWith("pi-")) {
      errors.icono = "El icono del módulo es obligario y comenzar con 'pi-'";
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
        response = await editarModulo(formData);
      } else {
        response = await guardarModulos(formData);
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
      console.error("Error al guardar el módulo:", error);
    }
  };

  const CheckboxChangeroles = (nombrePermiso, idRolModulo) => {
    console.log("idRolModulo:", idRolModulo);

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
      <Button
        tipo={'PRINCIPAL'}
        funcion={handleGuardar}
      >{rolesEdit.length !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  )

  return (
    <Dialog
      header={rolesEdit.length !== 0 ? <h1>Editar Módulo</h1> : <h1>Agregar Módulo</h1>}
      visible={visible}
      onHide={handleClose}
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
                value={ModulosAgg.cod_modulo}
                name="cod_modulo"
                className={`border-1 h-10 rounded-md px-3 py-2 ${errors.cod_modulo ? "border-red-500" : "border-gray-300"
                  }`}
                onChange={(e) => handleChangeModulos(e, "cod_modulo")}
                onKeyDown={(e) => handleSpacePrevention(e, "cod_modulo")}
              />
              {errors.cod_modulo && (
                <div className="text-red-600 text-xs ">{errors.cod_modulo}</div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-2 font-semibold">
                Icono de Modulo
              </label>
              <InputText
                value={ModulosAgg.icono}
                name="icono"
                className={`border-1 h-10 rounded-md px-3 py-2 ${errors.icono ? "border-red-500" : "border-gray-300"
                  }`}
                onChange={(e) => handleChangeModulos(e)}
              />
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
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre_modulo ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => handleChangeModulos(e)}
            />
            {errors.nombre_modulo && (
              <div className="text-red-600 text-xs ">
                {errors.nombre_modulo}
              </div>
            )}
          </div>
          <div className="pl-2 pt-3 mt-3 border rounded-md">
            <h1>Roles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded-md overflow-auto h-48 mt-2">
              {roles.map((rol) => (
                <div key={rol.id}>
                  {rol.id_rol == 1
                    ?
                    <>
                      <label
                        className="p-checkbox w-10 h-5 cursor-pointer relative rounded-full bg-primaryYellow">
                        <input
                          type="checkbox"
                          disabled
                          checked
                          className="sr-only peer"
                         
                        />
                        <span
                          className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}
                        ></span>
                      </label>
                      <span className="ml-6">{rol.nombre}</span>

                    </>
                    :

                    <>
                      <label
                        className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${fncChkPermiso(rol) ? "bg-primaryYellow" : "bg-gray-300"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={fncChkPermiso(rol)}
                          className="sr-only peer"
                          onChange={() =>
                            CheckboxChangeroles(rol.id_rol, rol.id_rol)
                          }
                        />
                        <span
                          className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}
                        ></span>
                      </label>
                      <span className="ml-6">{rol.nombre}</span>
                    </>
                  }
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
