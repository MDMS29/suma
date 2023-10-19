import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import useModulos from "../../hooks/useModulos";
import { Toast } from "primereact/toast";

const ModalAgregarModulo = ({ visible, onClose, guardarModulo }) => {
  // const [rolesSeleccionados, setRolesSeleccionados] = useState("");

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
    guardarModulos
  } = useModulos();

  const [rolesporModulo, setrolesporModulo] = useState([]);

  const mensajeGuardado = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro guardado con éxito', life: 5000 });
  }

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

  const handleGuardar = async () => {
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
        mensajeGuardado();
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

  return (
    <Dialog
      header={<h1>Agregar Módulo</h1>}
      visible={visible}
      onHide={handleClose}
      className="w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2"
    >
      <div>
      <Toast ref={toast} />
        <div className="flex flex-col pt-3 flex-wrap sm:w-full">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Código del Módulo
            </label>
            <InputText
              value={ModulosAgg.cod_modulo}
              name="cod_modulo"
              className="border-1 p-1 rounded-md h-10 px-3 py-2"
              onChange={(e) => handleChangeModulos(e)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Nombre del Módulo
            </label>
            <InputText
              value={ModulosAgg.nombre_modulo}
              name="nombre_modulo"
              className="border-1 p-1 rounded-md h-10 px-3 py-2"
              onChange={(e) => handleChangeModulos(e)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Icono de Modulo
            </label>
            <InputText
              value={ModulosAgg.icono}
              name="icono"
              className="border-1 p-1 rounded-md h-10 px-3 py-2"
              onChange={(e) => handleChangeModulos(e)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">Roles</label>
            <div className="p-datatable">
              {roles.map((rol) => (
                <div key={rol.id}>
                  <label className="p-checkbox">
                    <input
                      type="checkbox"
                      checked={fncChkPermiso(rol)}
                      onChange={() =>
                        CheckboxChangeroles(rol.id_rol, rol.id_rol)
                      }
                    />
                    <span className="p-checkbox-box"></span>
                  </label>
                  <span className="ml-2">{rol.nombre}</span>
                </div>
              ))}
            </div>
            {errors.roles && (
              <div className="text-red-600 mt-2">{errors.roles}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Button
          className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500 font-semibold"
          onClick={handleGuardar}
        >
          {rolesEdit.length !== 0 ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </Dialog>
  );
};

export default ModalAgregarModulo;
