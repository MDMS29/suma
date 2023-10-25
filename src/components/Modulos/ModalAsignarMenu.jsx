import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";

import {
  Edit_Icono,
  Trash_Icono
} from "../Icons/Iconos";
import useModulos from "../../hooks/useModulos";
import { MultiSelect } from "primereact/multiselect";
import useAuth from "../../hooks/useAuth";
import EliminarRestaurar from "../Modales/EliminarRestaurar";
import Loader from "../Loader";
import Forbidden from "../../Pages/Errors/forbidden";
import Button from "../Botones/Button";

const ModalAsignarMenu = ({ visible, onClose }) => {
  const {
    menus,
    dataMenus,
    guardarMenu,
    MenusAgg,
    setMenusAgg,
    editarMenu,
    ModuloState,
    setMenuState,
    MenuState,
    setMenuModulo,
    permisosModulo,
    eliminarRestablecerMenu,
    handleChangeMenu,
    dataModulos,
    obtenerMenus,
  } = useModulos();

  const { setVerEliminarRestaurar, verEliminarRestaurar, Permisos_DB, authPermisos } = useAuth();

  const [filteredData, setFilteredData] = useState(menus);

  const [isEditing, setIsEditing] = useState(false);
  const [enlace, setEnlace] = useState('');

  const [moduloNombre, setModuloNombre] = useState('');


  const columns = [
    { field: "id_menu", header: "ID" },
    { field: "nombre_menu", header: "Nombre" },
    { field: "link_menu", header: "Enlace" },
  ];

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    setFilteredData(dataMenus);
  }, [dataMenus]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setMenuModulo(authPermisos);
      }
    }, 10);
  }, [authPermisos]);

  useEffect(() => {
    // Busca el nombre del módulo en dataMenus
    const moduloEncontrado = dataModulos.find((modulo) => modulo.id_modulo === ModuloState);
    if (moduloEncontrado) {
      setModuloNombre(moduloEncontrado.nombre_modulo);
    }
    let enlace = `${moduloEncontrado?.nombre_modulo}/${MenusAgg.nombre_menu}`.split(' ').join('-')
    setEnlace(enlace.toLowerCase());

    
    setMenusAgg({...MenusAgg, link_menu: enlace})
  }, [ModuloState, MenusAgg.nombre_menu, dataMenus, enlace]);
  

  const modalEliminarMenu = (e, menu) => {
    e.preventDefault();
    setMenuState(menu);
    setVerEliminarRestaurar(true);
  };

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const header = (
    <MultiSelect
      options={columns}
      value={visibleColumns}
      optionLabel="header"
      onChange={onColumnToggle}
      className="w-full sm:w-20rem"
      display="chip"
    />
  );

  const handleClose = () => {
    onClose();

    setMenusAgg({
      id_modulo: 0,
      cod_modulo: "",
      nombre_modulo: "",
      icono: "",
    });

    obtenerMenus({});
  };

  const handleGuardarMenu = async () => {
    try {
      const formData = {
        id_menu: MenusAgg.id_menu,
        nombre_menu: MenusAgg.nombre_menu,
        link_menu: MenusAgg.link_menu,
        id_modulo: ModuloState.id_modulo,
        nombre_modulo: ModuloState.nombre_modulo,
      };
      const response = await guardarMenu(ModuloState, formData);

      if (response) {
        setMenusAgg({
          id_menu: 0,
          nombre_menu: "",
          link_menu: "",
        });
      }
    } catch (error) {
      console.error("Error al guardar el menú:", error);
    }
  };

  const handleEditarMenu = (rowData) => {
    setIsEditing(true);

    // Actualiza los campos del formulario con los valores de rowData
    setMenusAgg({
      id_menu: rowData.id_menu,
      nombre_menu: rowData.nombre_menu,
      link_menu: rowData.link_menu,
    });
  };

  const handleActualizarMenu = async () => {
    try {
      const response = await editarMenu(MenusAgg);
  
      if (response) {
  
        setIsEditing(false);
  
        // Limpia los campos del formulario
        setMenusAgg({
          id_menu: 0,
          nombre_menu: "",
          link_menu: "",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el menú:", error);
    }
  };
  

  const columnAcciones = (rowData) => {
    return (
      <div className="text-center flex gap-x-3">
        <PButton
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          className="p-button-rounded p-mr-2"
          onClick={() => handleEditarMenu(rowData)}
        >
          {Edit_Icono}
        </PButton>
        <PButton
          tooltip="Eliminar"
          className="p-button-rounded p-button-danger p-mr-2"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => modalEliminarMenu(e, rowData)}
        >
          {Trash_Icono}
        </PButton>
      </div>
    );
  };

  const main = () => (
    <>
    <Dialog
      header={<h1>Asignar Menú</h1>}
      visible={visible}
      onHide={handleClose}
      value={dataMenus}
    >
      <div>
        {verEliminarRestaurar && (
          <EliminarRestaurar
            tipo={"ELIMINAR"}
            funcion={(e) => eliminarRestablecerMenu(MenuState.id_menu, e)}
          />
        )}
        <div className="flex flex-col pt-3 flex-wrap sm:w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 pb-2 font-semibold">Nombre</label>
              <InputText
                className="border-1 h-10 rounded-md px-3 py-2  border-gray-300"
                value={MenusAgg.nombre_menu}
                name="nombre_menu"
                onChange={(e) => handleChangeMenu(e)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 pb-2 font-semibold">Enlace</label>
              <InputText
                className="border-1 h-10 rounded-md px-3 py-2 border-gray-300"
                value={enlace}
                disabled
                name="link_menu"
                onChange={(e) => handleChangeMenu(e)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end mt-3">
          <Button
          tipo={'PRINCIPAL'}
          funcion={isEditing ? handleActualizarMenu : handleGuardarMenu}
            // className="bg-primaryYellow p-2 rounded-md px-3 hover:bg-yellow-500"
            // onClick={isEditing ? handleActualizarMenu : handleGuardarMenu}
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </Button>
        </div>
        <div className="card mt-3">
          <DataTable
            className="custom-datatable"
            stripedRows
            value={filteredData}
            rows={5}
            header={header}
            emptyMessage="No se han encontrado resultados"
            tableStyle={{ minWidth: "50rem" }}
          >
            {visibleColumns.map((col) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}

            <Column
              key="actions"
              style={{ width: "10%" }}
              body={(rowData) => columnAcciones(rowData)}
            />
          </DataTable>
        </div>
      </div>
    </Dialog>
    </>
  );

  return (
    <>
      {permisosModulo.length === 0 ? (
        <Loader />
      ) : permisosModulo.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default ModalAsignarMenu;
