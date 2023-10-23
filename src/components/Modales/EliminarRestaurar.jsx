/* eslint-disable no-unused-vars */

import React from "react";
import Button from "../Botones/Button";

import { Dialog } from "primereact/dialog";
import useAuth from "../../hooks/useAuth";

// eslint-disable-next-line react/prop-types
const EliminarRestaurar = ({ tipo, funcion }) => {
    // console.log(funcion)

    const { verEliminarRestaurar, setVerEliminarRestaurar } = useAuth()

    const tipo_modal = {
        ELIMINAR: '¿Desea inactivar este registro?',
        RESTAURAR: '¿Desea restaurar este registro?',
        RESTABLECER_CLAVE: '¿Desea restablecer la clave del usuario?'
    }

    const footerModal = (
        <React.Fragment>
            <Button tipo="CANCELAR" funcion={e => setVerEliminarRestaurar(false)}>Cancelar</Button>
            <Button tipo='PRINCIPAL' funcion={e => funcion(e)}>{tipo_modal[tipo] === tipo_modal.ELIMINAR ? 'Eliminar' : tipo_modal[tipo] === tipo_modal.RESTABLECER_CLAVE ? 'Restablecer' : 'Restaurar' }</Button>
        </React.Fragment>
    );

    return (
        <Dialog
            modal
            visible={verEliminarRestaurar}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            onHide={e => setVerEliminarRestaurar(false)}
            footer={footerModal}
        >
            <div className="flex px-4 items-center">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "3rem" }}
                />
                <p className="text-2xl">{tipo_modal[tipo]}</p>
            </div>
        </Dialog>
    )
}

export default EliminarRestaurar