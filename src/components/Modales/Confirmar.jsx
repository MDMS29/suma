import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import useUsuarios from '../../hooks/useUsuarios'
import usePerfiles from "../../hooks/usePerfiles";


const Confirmar = ({ modalEliminar, setModalEliminar, mensajeEliminado, mensajeRestaurado, botonUsuario, mensajeRestablecido, mensajeEliminadoPerfil, mensajeRestauradoPerfil }) => {


    const { eliminarUsuarioProvider, usuarioState, restaurarUsuarioProvider, restablecerUsuarioProvider } = useUsuarios()
    const { perfilState, eliminarPerfilProvider, restaurarPerfilProvider } = usePerfiles()

    let mss = ""
    let btn = ""

    let variableModal = 0
    const funcionModal = () => {
        if (usuarioState) {
            if (usuarioState.id_estado == 1 && botonUsuario == 1) {
                variableModal = 1
            } if (usuarioState.id_estado == 2) {
                variableModal = 2
            } if (usuarioState.id_estado == 1 && botonUsuario == 2) {
                variableModal = 3
            }
        } if (perfilState) {
            if (perfilState.id_estado == 1) {
                variableModal = 4
            } if (perfilState.id_estado == 2) {
                variableModal = 5
            }
        }
    }
    funcionModal()

    const esconderModalEliminar = () => {
        setModalEliminar(false);
    };

    const clickModalUsuario = () => {
        if (variableModal == 1) {
            eliminarUsuarioProvider()
            setModalEliminar(false);
            mensajeEliminado()
        } if (variableModal == 2) {
            restaurarUsuarioProvider()
            setModalEliminar(false);
            mensajeRestaurado()
        } if (variableModal == 3) {
            restablecerUsuarioProvider()
            setModalEliminar(false);
            mensajeRestablecido()
        }
        if (variableModal == 4) {
            eliminarPerfilProvider()
            setModalEliminar(false);
            mensajeEliminadoPerfil()
        }
        if (variableModal == 5) {
            restaurarPerfilProvider()
            setModalEliminar(false);
            mensajeRestauradoPerfil()
        }
    }

    switch (variableModal) {
        case 2:
        case 5:
            mss = "¿Deseas restaurar este registro?"
            btn = "Restaurar"
            break;
        case 3:
            mss = "¿Estás seguro de que deseas restaurar la contraseña?"
            btn = "Restablecer"
            break;
        case 1:
        case 4:
            mss = "¿Estás seguro de que deseas inactivar este registro?"
            btn = "Eliminar"
            break;
    }


    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" onClick={esconderModalEliminar} className='px-4 p-2 mx-2 rounded-md font-semibold 
            bg-neutralGray hover:bg-hoverGray transition duration-300 ease-in-out' />
            <Button label={btn}
                onClick={clickModalUsuario} className="px-4 p-2 mx-2 rounded-md font-semibold
            bg-secundaryYellow hover:bg-primaryYellow transition duration-300 ease-in-out" />
        </React.Fragment>
    );

    return (
        <Dialog visible={modalEliminar} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal onHide={esconderModalEliminar} footer={deleteProductDialogFooter}>
            <div className="flex px-4">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '3rem' }} />
                <p className='text-2xl'>
                    {mss}
                </p>
            </div>
        </Dialog>
    )
};

export default Confirmar;