import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import useUsuarios from "../../hooks/useUsuarios";

const ModalAgregarUsuarios = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);

  const {
    UsuariosAgg,
    handleChangeUsuario,
    obtenerPerfiles,
    perfilesAgg,
    obtenerModulos,
    modulosAgg,
    setModulosAgg,
    permisosAgg,
    guardarUsuario,
    errors,
    setErrors,
  } = useUsuarios();

  const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);
  const [modulosSeleccionados, setModulosSeleccionados] = useState([]);
  const [permisosPorModulo, setPermisosPorModulo] = useState([]);

  const handleGuardar = async () => {
    try {
      const formData = {
        nombre_completo: UsuariosAgg.nombre, //nombre_completo
        usuario: UsuariosAgg.usuario,
        correo: UsuariosAgg.correo,
        clave: UsuariosAgg.clave,
        // claverepetida: UsuariosAgg.claverepetida,
        perfiles: perfilesSeleccionados,
        roles: permisosPorModulo,
      };

      // Llama a la función de guardarUsuario y pasa el formData
      const response = await guardarUsuario(formData);

      // Maneja la respuesta del guardado si es necesario
      // Por ejemplo, puedes mostrar un mensaje de éxito o redirigir a otra página
      console.log("Usuario guardado con éxito:", response);
    } catch (error) {
      // Maneja los errores si ocurren
      console.error("Error al guardar el usuario:", error);
    }
  };



  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (step === 2) {
      obtenerPerfiles();
    } else if (step === 3) {
      obtenerModulos(perfilesSeleccionados);
    }
  }, [step]);

  const footerContent = (
    <div>
      {step > 1 && (
        <Button
          className="p-button-text bg-gray-300 p-2 mx-2 rounded-md px-3 hover:bg-gray-400"
          onClick={handlePrev}
        >
          Atrás
        </Button>
      )}
      {step < 3 ? (
        <Button
          className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500"
          onClick={handleNext}
        >
          Siguiente
        </Button>
      ) : (
        <Button
          className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500"
          onClick={handleGuardar}
        >
          Guardar
        </Button>
      )}
    </div>
  );
  const CheckboxChange = (rowData) => {
    const perfilId = rowData.id_perfil;

    // Verifica si el perfil ya está en la lista de seleccionados
    if (
      perfilesSeleccionados.some(
        (perfil) => perfil.id_perfil === rowData.id_perfil
      )
    ) {
      // Si está en la lista, lo deselecciona
      const updatedSeleccionados = perfilesSeleccionados.filter(
        (per) => per.id_perfil !== perfilId
      );
      setPerfilesSeleccionados(updatedSeleccionados);
    } else {
      // Si no está en la lista, lo selecciona
      setPerfilesSeleccionados([
        ...perfilesSeleccionados,
        { id_perfil: perfilId },
      ]);
    }
  };
  const CheckboxChangeModulo = (rowData) => {
    const moduloId = rowData.id_modulo;

    if (
      modulosSeleccionados.some(
        (modulo) => modulo.id_modulo === rowData.id_modulo
      )
    ) {
      // Deseleccionar el módulo
      const updatedSeleccionados = modulosSeleccionados.filter(
        (mod) => mod.id_modulo !== moduloId
      );
      setModulosSeleccionados(updatedSeleccionados);

      // También debes eliminar los permisos asociados al módulo deseleccionado
      const updatedPermisos = { ...permisosPorModulo };
      delete updatedPermisos[moduloId];
      setPermisosPorModulo(updatedPermisos);
    } else {
      // Inicializar los permisos asociados al módulo seleccionado como un arreglo vacío
      setPermisosPorModulo([...permisosPorModulo, { id_rol: moduloId }]);
    }
    console.log();
  };

  const CheckboxChangePermiso = (permisoId, moduloId, idRolModulo) => {
    // Verifica si el permiso ya está en la lista de seleccionados
    if (permisosPorModulo.some((permiso) => permiso.id_rol === idRolModulo)) {
      permisosPorModulo.filter((permiso) => permiso.id_rol !== idRolModulo);
    } else {
      // Actualizar los permisos seleccionados para el módulo
      const updatedPermisos = [...permisosPorModulo, { id_rol: idRolModulo }];
      setPermisosPorModulo(updatedPermisos);
    }

    // Muestra en la consola lo que se ha seleccionado/deseleccionado y el id_rol_modulo
    // console.log(
    //   `Permiso "${permisoId}" en módulo "${moduloId}" seleccionado. id_rol_modulo: ${idRolModulo}`
    // );
  };
  console.log(permisosPorModulo);

  const checkboxPerfil = (rowData) => {
    return (
      <input
        type="checkbox"
        checked={perfilesSeleccionados.some(
          (perfil) => perfil.id_perfil == rowData.id_perfil
        )}
        onChange={() => CheckboxChange(rowData)}
      />
    );
  };

 

  

  return (
    <Dialog
      header="Agregar Usuario"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onClose}
      footer={footerContent}
    >
      <div>
        {step === 1 && (
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <label className="text-gray-600">Nombre completo</label>
                  <InputText
                    value={UsuariosAgg.nombre}
                    type="text"
                    name="nombre"
                    className={`border-1 p-1 rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleChangeUsuario(e)}
                  />
                   {errors.nombre && <div className="text-red-600 text-xs w-44">{errors.nombre}</div>}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600">Usuario</label>
                  <InputText
                    value={UsuariosAgg.usuario}
                    type="text"
                    name="usuario"
                    className={`border-1 p-1 rounded-md ${errors.usuario ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleChangeUsuario(e)}
                  />
                  {errors.usuario && <div className="text-red-600 text-xs w-44">{errors.usuario}</div>}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600">Correo</label>
                <InputText
                  value={UsuariosAgg.correo}
                  type="email"
                  name="correo"
                  className={`border-1 p-1 rounded-md ${errors.correo ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleChangeUsuario(e)}
                />
                {errors.correo && <div className="text-red-600 text-sm">{errors.correo}</div>}
              </div>

              <div className="flex flex-row space-x-4">
                <div className="flex flex-col">
                  <label className="text-gray-600">Contraseña</label>
                  <InputText
                    value={UsuariosAgg.clave}
                    type="password"
                    name="clave"
                    className={`border-1 p-1 rounded-md ${errors.clave ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleChangeUsuario(e)}
                  />
                  {errors.clave && <div className="text-red-600">{errors.clave}</div>}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600">Repetir Contraseña</label>
                  <InputText
                    value={UsuariosAgg.claverepetida}
                    type="password"
                    name="claverepetida"
                    className={`border-1 p-1 rounded-md ${errors.claverepetida ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleChangeUsuario(e)}
                    />
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h1>Perfiles</h1>
            <div className="p-mx-auto mt-3 p-datatable">
              <DataTable value={perfilesAgg}>
                <Column field="id_perfil" header="ID" />
                <Column field="nombre_perfil" header="Nombre" />
                <Column
                  field="col1"
                  header="Check"
                  body={checkboxPerfil}
                  style={{ width: "3em" }}
                />
              </DataTable>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h1>Modulos</h1>
            <div className="p-mx-auto mt-3 p-datatable">
              <DataTable value={modulosAgg}>
                <Column field="id_modulo" header="ID" />
                <Column field="nombre_modulo" header="Nombre del Módulo" />

                {/* Columna para el permiso "Consultar" */}
                <Column
                  header="Consultar"
                  body={(rowData) =>
                    rowData.permisos.map((r, index) => {
                      if (r.nombre === "Consultar") {
                        return (
                          <input
                            key={index}
                            type="checkbox"
                            data-idrolmodulo={r.id_rol_modulo}
                            checked={
                              permisosPorModulo.some(permiso => permiso.id_rol == r.id_rol_modulo)
                            }
                            onChange={() =>
                              CheckboxChangePermiso(
                                "Consultar",
                                rowData.id_modulo,
                                r.id_rol_modulo
                              )
                            }
                          />
                        );
                      }
                    })
                  }
                  style={{ width: "5em" }}
                />

                {/* Columna para el permiso "Crear/Editar" */}
                <Column
                  header="Crear/Editar"
                  body={(rowData) =>
                    rowData.permisos.map((r, index) => {
                      if (r.nombre === "Crear/Editar") {
                        return (
                          <input
                            key={index}
                            type="checkbox"
                            data-idrolmodulo={r.id_rol_modulo}
                            checked={
                              permisosPorModulo.some(permiso => permiso.id_rol == r.id_rol_modulo)
                            }
                            onChange={() =>
                              CheckboxChangePermiso(
                                "Crear/Editar",
                                rowData.id_modulo,
                                r.id_rol_modulo
                              )
                            }
                          />
                        );
                      }
                    })
                  }
                  style={{ width: "5em" }}
                />

                {/* Columna para el permiso "Eliminar" */}
                <Column
                  header="Eliminar"
                  body={(rowData) =>
                    rowData.permisos.map((r, index) => {
                      if (r.nombre === "Borrar") {
                        return (
                          <input
                            key={index}
                            type="checkbox"
                            data-idrolmodulo={r.id_rol_modulo}
                            checked={
                              permisosPorModulo.some(permiso => permiso.id_rol == r.id_rol_modulo)
                            }
                            onChange={() =>
                              CheckboxChangePermiso(
                                "Borrar",
                                rowData.id_modulo,
                                r.id_rol_modulo
                              )
                            }
                          />
                        );
                      }
                    })
                  }
                  style={{ width: "5em" }}
                />
              </DataTable>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ModalAgregarUsuarios;
