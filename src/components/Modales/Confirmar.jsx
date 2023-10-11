import React from "react"
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import useUsuarios from '../../hooks/useUsuarios'


const Eliminar = ({ modalEliminar, setModalEliminar, mensajeEliminado, mensajeRestaurado }) => {


    const { eliminarUsuarioProvider, eliminarUsuario } = useUsuarios()

    const esconderModalEliminar = () => {
        setModalEliminar(false);
        mensajeRestaurado()
    };
    const clickEliminarUsuario = () => {
        eliminarUsuarioProvider()
        setModalEliminar(false);
        mensajeEliminado()
    }

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" onClick={esconderModalEliminar} className='px-4 p-2 mx-2 rounded-md font-semibold 
            bg-neutralGray hover:bg-hoverGray transition duration-300 ease-in-out' />
            <Button label="Eliminar" onClick={clickEliminarUsuario} className="px-4 p-2 mx-2 rounded-md font-semibold
            bg-secundaryYellow hover:bg-primaryYellow transition duration-300 ease-in-out" />
        </React.Fragment>
    );

    return (
            <Dialog visible={modalEliminar} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal onHide={esconderModalEliminar} footer={deleteProductDialogFooter}>
                <div className="flex px-5">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '3rem' }} />
                    <p className='text-2xl'>
                    {eliminarUsuario.estado_usuario == "ACTIVO" ? "¿Estás seguro de que deseas inactivar este usuario?" : "¿Deseas restaurar este usuario?"}
                        
                    </p>
                </div>
            </Dialog>
    )
}

export default Eliminar