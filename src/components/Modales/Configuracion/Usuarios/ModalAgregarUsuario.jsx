import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Steps } from "primereact/steps";
import { Message } from "primereact/message";
import useUsuarios from "../../../../hooks/Configuracion/useUsuarios";
import Button from "../../../Botones/Button";
import { Dropdown } from "primereact/dropdown";
import useAuth from "../../../../hooks/useAuth";
import useEmpresas from "../../../../hooks/useEmpresas";

// eslint-disable-next-line react/prop-types
const ModalAgregarUsuarios = ({ visible, onClose }) => {

  const {
    UsuariosAgg,
    obtener_perfiles,
    perfilesAgg,
    obtener_modulos,
    modulosAgg,
    guardar_usuario,
    errors,
    setErrors,
    setUsuariosAgg,
    perfilesEdit,
    permisosEdit,
    editar_usuario
  } = useUsuarios();

  const { authUsuario } = useAuth()
  const { obtener_empresas, dataEmpresas } = useEmpresas()

  const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);
  const [permisosPorModulo, setPermisosPorModulo] = useState([]);
  const [step, setStep] = useState(1);
 console.log(UsuariosAgg);

  useEffect(() => {
    if (authUsuario.perfiles.some((perfil) => perfil.id_perfil == 1)) {
      obtener_empresas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (UsuariosAgg.id_usuario) {
      setPerfilesSeleccionados(perfilesEdit)
      setPermisosPorModulo(permisosEdit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permisosEdit, perfilesEdit])


  const cerrar_modal = () => {
    // Cierra el Dialog y reinicia el estado
    onClose();

    // Limpia los campos del formulario
    setUsuariosAgg({
      id_usuario: 0,
      nombre: "",
      usuario: "",
      correo: "",
      clave: "",
      clave_repetida: "",
      id_empresa: "",
    });

    // Limpia las selecciones
    setPerfilesSeleccionados([]);
    setPermisosPorModulo([]);

    // Limpia los errores
    setErrors({});
  };

  const manejo_espacios_blancos = (e) => {
    if (e.key === ' ') {
      e.preventDefault(); // Evitar la entrada de espacios en blanco
    }
  };

  const btn_cambio_usuario = e => {
    const value = e.target.value;

    setUsuariosAgg({ ...UsuariosAgg, [e.target.name]: e.target.name == "nombre" ? value.replace(/\d/g, '') : value });
  };

  const btn_guardar = async () => {
    const formData = {
      id_usuario: UsuariosAgg.id_usuario,
      nombre_completo: UsuariosAgg.nombre,
      usuario: UsuariosAgg.usuario,
      correo: UsuariosAgg.correo,
      clave: UsuariosAgg.clave,
      id_empresa: UsuariosAgg.id_empresa,
      perfiles: perfilesSeleccionados,
      roles: permisosPorModulo,
    };

    if (permisosPorModulo.length === 0 || permisosPorModulo.filter(permiso => permiso?.id_estado === 1).length === 0) {
      errors.modulos = "Debes seleccionar al menos un modulo";
      return
    }

    try {
      let response
      if (UsuariosAgg.id_usuario !== 0) {
        response = await editar_usuario(formData)
      } else {
        response = await guardar_usuario(formData);
      }

      if (response) {
        onClose(); // Cierra el modal
        setStep(1); // Vuelve al primer paso

        // Limpia los campos del formulario
        setUsuariosAgg({
          id_usuario: 0,
          nombre: "",
          usuario: "",
          correo: "",
          clave: "",
          clave_repetida: "",
          id_empresa: "",
        });
        setPerfilesSeleccionados([]);
        setPermisosPorModulo([]);
      }
    } catch (error) {
      // Maneja los errores si ocurren
      console.error("Error al guardar el usuario:", error.response.data.message);
    }
  };

  const btn_siguiente = () => {
    // Realiza las validaciones aquí antes de avanzar al siguiente paso
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const errors = {};

    if (step === 1) {
      if (UsuariosAgg.nombre.length < 10 || UsuariosAgg.nombre.length > 30) {
        errors.nombre =
          "El nombre completo debe tener entre 10 y 30 caracteres";
      }

      if (UsuariosAgg.nombre.trim() === '') {
        errors.nombre = "Este campo es obligatorio"
      }

      if (UsuariosAgg.usuario.length < 5 || UsuariosAgg.usuario.length > 15) {
        errors.usuario = "El usuario debe tener entre 5 y 15 caracteres";
      }

      if (!emailPattern.test(UsuariosAgg.correo)) {
        errors.correo = "El correo electrónico no es válido";
      }
      if (
        UsuariosAgg.clave.trim() === "" &&
        UsuariosAgg.clave_repetida.trim() === "" && perfilesEdit.length <= 0
      ) {
        // Para cuando ambos campos están vacíos
        errors.clave = "La clave está vacía";
        errors.clave_repetida = "La confirmación de clave está vacía";
      } else if (UsuariosAgg.clave !== UsuariosAgg.clave_repetida) {
        // Para cuando las contraseñas no coinciden
        errors.clave = "Las contraseñas no coinciden";
        errors.clave_repetida = "Las contraseñas no coinciden";
      }
    }
    if (step === 2) {
      if (perfilesSeleccionados.length === 0 || perfilesSeleccionados.filter(perfil => perfil?.estado_perfil === 1).length === 0) {
        errors.perfiles = "Debes seleccionar al menos un perfil";
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const btn_anterior = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (step === 2) {
      obtener_perfiles();
    } else if (step === 3) {
      obtener_modulos(perfilesSeleccionados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);


  const chk_perfil = (rowData) => {
    const perfil_id = rowData;

    if (perfilesSeleccionados.find(perfil => perfil.id_perfil == perfil_id)) {
      if (perfilesEdit.find(perfil => perfil.id_perfil == perfil_id)) {
        const [perfil] = perfilesSeleccionados.filter(perfil => perfil.id_perfil == perfil_id)
        if (perfil.estado_perfil == 1) {
          perfil.estado_perfil = 2

        } else {
          perfil.estado_perfil = 1
        }
        const perfilesActualizados = perfilesSeleccionados.map(perfilState => perfilState.id_perfil == perfil.id_perfil ? perfil : perfilState)
        setPerfilesSeleccionados(perfilesActualizados)
      } else {
        const perfiles = perfilesSeleccionados.filter(perfil => perfil.id_perfil !== perfil_id)
        setPerfilesSeleccionados(perfiles)
      }
    } else {
      setPerfilesSeleccionados([...perfilesSeleccionados, { id_perfil: perfil_id, estado_perfil: 1 }])
    }
  };

  const chk_perfil_seleccionado = (row) => {
    const perfil = perfilesSeleccionados.filter((perfil) => perfil.id_perfil === row.id_perfil)
    if (perfil) {
      return perfil[0]?.estado_perfil === 1
    } else {
      return false
    }
  }

  const chk_permiso = (nombrePermiso, idRolModulo) => {
    if (permisosPorModulo.find(permiso => permiso.id_rol == idRolModulo)) {
      if (permisosEdit.find(permiso => permiso.id_rol == idRolModulo)) {
        const [permiso] = permisosPorModulo.filter(permiso => permiso.id_rol == idRolModulo)
        if (permiso.id_estado == 1) {
          permiso.id_estado = 2
        } else {
          permiso.id_estado = 1
        }
        const permisosActuliazados = permisosPorModulo.map(permisoState => permisoState.id_rol == permiso.id_rol ? permiso : permisoState)
        setPermisosPorModulo(permisosActuliazados)
      } else {
        const permisos = permisosPorModulo.filter(permiso => permiso.id_rol !== idRolModulo)
        setPermisosPorModulo(permisos)
      }
    } else {
      setPermisosPorModulo([...permisosPorModulo, { id_rol: idRolModulo, id_estado: 1 }])
    }
  };

  const chk_permiso_seleccionado = (row) => {
    const permiso = permisosPorModulo.filter((permiso) => permiso.id_rol === row.id_rol_modulo)
    if (permiso) {
      return permiso[0]?.id_estado == 1
    } else {
      return false
    }
  }

  const footerContent = (
    <div>
      {step > 1 && (
        <Button
          tipo={'CANCELAR'}
          funcion={btn_anterior}
        >
          Atrás
        </Button>
      )}
      {step < 3 ? (
        <Button
          tipo={'PRINCIPAL'}
          funcion={btn_siguiente}
        >
          Siguiente
        </Button>
      ) : (
        <Button
          tipo={'PRINCIPAL'}
          funcion={btn_guardar}
        >
          {perfilesEdit.length !== 0 ? 'Actualizar' : 'Guardar'}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog
      header={perfilesEdit.length !== 0 ? <h1>Editar Usuario</h1> : <h1>Agregar Usuario</h1>}
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div>
        <Steps
          model={[
            { label: "Informacion" },
            { label: "Perfiles" },
            { label: "Permisos" }
          ]}
          activeIndex={step - 1}
          className="custom-stepper p-4 hidden md:block"
        />
        <hr className="mb-4" />
        {step === 1 && (
          <div className="flex flex-col pt-3 flex-wrap sm:w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">Nombre completo <span className="font-bold text-red-900">*</span></label>
                <InputText
                  value={UsuariosAgg.nombre}
                  type="text"
                  name="nombre"
                  className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                  onChange={(e) => btn_cambio_usuario(e)}
                />
                {errors.nombre && (
                  <div className="text-red-600 text-xs w-44">
                    {errors.nombre}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">Usuario <span className="font-bold text-red-900">*</span></label>
                <InputText
                  value={UsuariosAgg.usuario}
                  type="text"
                  name="usuario"
                  className={`border-1 p-1 rounded-md h-10 px-3 py-2 ${errors.usuario ? "border-red-500" : "border-gray-300"
                    }`}
                  onKeyPress={manejo_espacios_blancos}
                  onChange={(e) => btn_cambio_usuario(e)}
                />
                {errors.usuario && (
                  <div className="text-red-600 text-xs w-44">
                    {errors.usuario}
                  </div>
                )}
              </div>
              {authUsuario.perfiles?.some((perfil) => perfil.id_perfil == 1) && authUsuario.id_empresa == 1 &&
                <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2"> {/* /*col-span-2*/}
                  <label className="text-gray-600 pb-2 font-semibold">Empresas <span className="font-bold text-red-900">*</span></label>
                  <div className="card flex justify-content-center w-full">

                    <Dropdown value={UsuariosAgg.id_empresa} onChange={(e) => btn_cambio_usuario(e)} options={dataEmpresas}
                      name="id_empresa"
                      optionLabel="razon_social"
                      optionValue= "id_empresa" 
                      placeholder="Seleccione una empresa"
                      filter className="w-full md:w-14rem" />
                    {/* <Dropdown value={UsuariosAgg.id_empresa} onChange={(e) => setDataEmpresas(e.value)} options={
                    Array.isArray(dataEmpresas) && dataEmpresas.length > 0
                      ? dataEmpresas.map((e) => ({
                        label: e.razon_social,
                        value: e.id_empresa,
                      }))
                      : [{ label: "No hay datos disponibles", value: "" }]
                  }
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione una empresa"
                    filter className="w-full md:w-14rem" /> */}

                  </div>

                  {errors.correo && (
                    <div className="text-red-600 text-sm">{errors.correo}</div>
                  )}
                </div>
              }

              <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2"> {/* /*col-span-2*/}
                <label className="text-gray-600 pb-2 font-semibold">Correo <span className="font-bold text-red-900">*</span></label>
                <InputText
                  value={UsuariosAgg.correo}
                  type="email"
                  name="correo"
                  className={`border-1 p-1 rounded-md h-10 px-3 py-2 ${errors.correo ? "border-red-500" : "border-gray-300"
                    }`}
                  onChange={(e) => btn_cambio_usuario(e)}
                />
                {errors.correo && (
                  <div className="text-red-600 text-sm">{errors.correo}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">Contraseña <span className="font-bold text-red-900">*</span></label>
                <InputText
                  value={UsuariosAgg.clave}
                  type="password"
                  name="clave"
                  className={`border-1 p-1 rounded-md h-10 px-3 py-2 ${errors.clave ? "border-red-500" : "border-gray-300"
                    }`}
                  onChange={(e) => btn_cambio_usuario(e)}
                />
                {errors.clave && (
                  <div className="text-red-600 text-xs ">{errors.clave}</div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">Repetir Contraseña <span className="font-bold text-red-900">*</span></label>
                <InputText
                  value={UsuariosAgg.clave_repetida}
                  type="password"
                  name="clave_repetida"
                  className={`border-1 p-1 rounded-md h-10 px-3 py-2 ${errors.clave_repetida ? "border-red-500" : "border-gray-300"
                    }`}
                  onChange={(e) => btn_cambio_usuario(e)}
                />
                {errors.clave_repetida && (
                  <div className="text-red-600 text-xs ">
                    {errors.clave_repetida}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="pl-2 pt-3 mt-3 border rounded-md">
            <h1>Perfiles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded-md overflow-auto h-48">
              {perfilesAgg.map((perfil) => (
                <div key={perfil.id}>
                  <label
                    className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_perfil_seleccionado(perfil) ? "bg-primaryYellow" : "bg-gray-300"
                      }`}>
                    <input
                      type="checkbox"
                      checked={chk_perfil_seleccionado(perfil)}
                      className="sr-only peer"
                      onChange={() =>
                        chk_perfil(perfil.id_perfil, perfil.id_perfil)
                      } />
                    <span
                      className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                  </label>
                  <span className="ml-6">{perfil.nombre_perfil}</span>

                </div>
              ))}
            </div>

            <div className="p-mx-auto mt-3 p-datatable">
              {errors.perfiles && (
                <Message
                  severity="warn"
                  text="Debes seleccionar al menos un perfil"
                  className="w-full"
                >
                  {errors.perfiles}
                </Message>
              )}

            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h1>Modulos</h1>
            <div className="p-mx-auto mt-3 p-datatable">
              <DataTable value={modulosAgg} className="custom-datatable">
                {/* <Column field="id_modulo" header="ID" /> */}
                <Column field="nombre_modulo" />

                {/* Columna para el permiso "Consultar" */}
                <Column
                  header="Consultar"
                  body={(rowData) =>

                    rowData.permisos.map((r) => {
                      if (r.nombre === "Consultar") {
                        return (
                          <div key={r.id_rol} className="flex items-center justify-center">
                            <label
                              className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_permiso_seleccionado(r) ? "bg-primaryYellow" : "bg-gray-300"
                                }`}>
                              <input
                                type="checkbox"
                                checked={chk_permiso_seleccionado(r)}
                                className="sr-only peer"
                                onChange={() =>
                                  chk_permiso(r.id_rol_modulo, r.id_rol_modulo)
                                }
                              />
                              <span
                                className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                            </label>
                          </div>
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
                    rowData.permisos.map((r) => {
                      if (r.nombre === "Crear/Editar") {
                        return (
                          <div key={r.id_rol} className="flex items-center justify-center">
                            <label
                              className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_permiso_seleccionado(r) ? "bg-primaryYellow" : "bg-gray-300"
                                }`}>
                              <input
                                type="checkbox"
                                checked={chk_permiso_seleccionado(r)}
                                className="sr-only peer"
                                onChange={() =>
                                  chk_permiso(r.id_rol_modulo, r.id_rol_modulo)
                                }
                              />
                              <span
                                className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                            </label>
                          </div>
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
                    rowData.permisos.map((r) => {
                      if (r.nombre === "Borrar") {
                        return (

                          <div key={r.id_rol} className="flex items-center justify-center">
                            <label
                              className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_permiso_seleccionado(r) ? "bg-primaryYellow" : "bg-gray-300"
                                }`}>
                              <input
                                type="checkbox"
                                checked={chk_permiso_seleccionado(r)}
                                className="sr-only peer"
                                onChange={() =>
                                  chk_permiso(r.id_rol_modulo, r.id_rol_modulo)
                                }
                              />
                              <span
                                className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                            </label>
                          </div>
                        );
                      }
                    })
                  }
                  style={{ width: "5em" }}
                />
                <Column
                  header="Restaurar"
                  body={(rowData) =>
                    rowData.permisos.map((r) => {
                      if (r.nombre === "Restaurar") {
                        return (
                          <div key={r.id_rol} className="flex items-center justify-center">
                            <label
                              className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_permiso_seleccionado(r) ? "bg-primaryYellow" : "bg-gray-300"
                                }`}>
                              <input
                                type="checkbox"
                                checked={chk_permiso_seleccionado(r)}
                                className="sr-only peer"
                                onChange={() =>
                                  chk_permiso(r.id_rol_modulo, r.id_rol_modulo)
                                }
                              />
                              <span
                                className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                            </label>
                          </div>
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