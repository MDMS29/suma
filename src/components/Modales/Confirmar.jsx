import React from "react"
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import useUsuarios from '../../hooks/useUsuarios'


const Eliminar = ({ modalEliminar, setModalEliminar, mensajeEliminado, mensajeRestaurado, botonUsuario, mensajeRestablecido }) => {


    const { eliminarUsuarioProvider, usuarioState, restaurarUsuarioProvider, restablecerUsuarioProvider } = useUsuarios()

    let variableModal = 0
    const funcionModal = () => {
        if (usuarioState.estado_usuario == "ACTIVO" && botonUsuario == 1) {
            variableModal = 1
        } if (usuarioState.estado_usuario == "INACTIVO") {
            variableModal = 2
        } if (usuarioState.estado_usuario == "ACTIVO" && botonUsuario == 2) {
            variableModal = 3
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
    }

    const textoModal = () => {
        let mss = ""
        let btn = ""
        switch (variableModal) {
            case 2:
                mss = "¿Deseas restaurar este usuario?"
                btn = "Restaurar"
                break;
            case 3:
                mss = "¿Estás seguro de que deseas restaurar la contraseña?"
                btn = "Restablecer"
                break;
            default:
                mss = "¿Estás seguro de que deseas inactivar este usuario?"
                btn = "Eliminar"
                break;
        }
        return { mss, btn }
    }

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" onClick={esconderModalEliminar} className='px-4 p-2 mx-2 rounded-md font-semibold 
            bg-neutralGray hover:bg-hoverGray transition duration-300 ease-in-out' />
            <Button label={textoModal().btn}
                onClick={clickModalUsuario} className="px-4 p-2 mx-2 rounded-md font-semibold
            bg-secundaryYellow hover:bg-primaryYellow transition duration-300 ease-in-out" />
        </React.Fragment>
    );

    return (
        <Dialog visible={modalEliminar} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal onHide={esconderModalEliminar} footer={deleteProductDialogFooter}>
            <div className="flex px-4">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '3rem' }} />
                <p className='text-2xl'>
                    {textoModal().mss}
                </p>
            </div>
        </Dialog>
    )
}

export default Eliminar