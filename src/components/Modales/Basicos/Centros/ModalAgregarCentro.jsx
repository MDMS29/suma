/* eslint-disable react/prop-types */

import { Dialog } from 'primereact/dialog'
import useCentros from '../../../../hooks/Basicos/useCentros'
import useAuth from '../../../../hooks/useAuth'
import useProcesos from '../../../../hooks/Basicos/useProcesos'
import Button from '../../../Botones/Button'
import { InputText } from 'primereact/inputtext'
import { useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'

const ModalAgregarCentro = ({ visible, onClose }) => {

    const { setErrors, errors, CentrosAgg, setCentrosAgg, editar_centro_costo, guardar_centro_costo } = useCentros()
    const { authUsuario } = useAuth()
    const { obtener_procesos, dataProcesos } = useProcesos()

    useEffect(() => {
        obtener_procesos()
    }, [])

    const cerrar_modal = () => {
        onClose();
        setCentrosAgg({
            id_centro: 0,
            id_empresa: authUsuario.id_empresa,
            codigo: "",
            centro_costo: "",
            correo_responsable: "",
        });
        setErrors({});
    };

    const btn_cambio_campo = (e) => {
        const value = e.target.value;
        setCentrosAgg({ ...CentrosAgg, [e.target.name]: e.target.name.includes(['correo_responsable', 'codigo']) ? value.replace(/\d/g, '') : value });
    };

    const btn_guardar = async () => {

        const regex = /^[a-zA-Z0-9\s]*$/;
        const errors = {};
        const codigoRegex = /^[0-9]*$/;


        if (!CentrosAgg.codigo) {
            errors.codigo = "El codigo es obligatorio";
        } else if (!codigoRegex.test(CentrosAgg.codigo)) {
            errors.codigo = "El codigo debe contener solo dígitos";
        }

        if (CentrosAgg.centro_costo.trim() === '') {
            errors.centro_costo = "Este campo es obligatorio"
            setErrors(errors);
            return
        }
        if (!regex.test(CentrosAgg.centro_costo)) {
            errors.centro_costo = "No se permiten caracteres especiales";
            setErrors(errors);
            return
        }
        if (!codigoRegex.test(CentrosAgg.consecutivo)) {
            errors.consecutivo = "Este campo solo permite numeros";
            setErrors(errors);
            return
        }
        if (CentrosAgg.id_proceso == 0) {
            errors.id_proceso = "Este campo es obligatorio"
            setErrors(errors);
            return
        }
        if (CentrosAgg.correo_responsable.trim() === '') {
            errors.correo_responsable = "Este campo es obligatorio"
            setErrors(errors);
            return
        }

        try {
            let response;
            if (CentrosAgg.id_centro !== 0) {
                response = await editar_centro_costo(CentrosAgg);
            } else {
                response = await guardar_centro_costo(CentrosAgg);
            }

            if (response) {
                onClose();
                setErrors({});
            }

        } catch (error) {
            console.error("Error al guardar la marca:", error);
        }
        setErrors({});
    }

    const footerContent = (
        <div>
            <Button
                tipo={'PRINCIPAL'}
                funcion={btn_guardar}
            > {CentrosAgg.id_centro !== 0 ? 'Actualizar' : 'Guardar'}
            </Button>
        </div>
    );

    return (
        <Dialog
            header={CentrosAgg.id_centro !== 0 ? <h1>Editar Centro</h1> : <h1>Agregar Centro</h1>}
            visible={visible}
            onHide={cerrar_modal}
            className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
            footer={footerContent}
        >
            <div className="flex flex-col pt-3 gap-3 flex-wrap w-full">
                {/* <div className=""> */}
                <div className='flex gap-3 flex-wrap '>
                    <div className="flex flex-grow flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Codigo <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={CentrosAgg.codigo}
                            type="number"
                            name="codigo"
                            className={`border-1 h-10 rounded-md w-full px-3 ${errors.codigo ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_campo(e)}
                        />
                        {errors.codigo && (
                            <div className="text-red-600 text-xs">
                                {errors.codigo}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-grow flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Nombre <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={CentrosAgg.centro_costo}
                            type="text"
                            name="centro_costo"
                            className={`border-1 h-10 rounded-md w-full px-3 ${errors.centro_costo ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_campo(e)}
                        />
                        {errors.centro_costo && (
                            <div className="text-red-600 text-xs">
                                {errors.centro_costo}
                            </div>
                        )}

                    </div>

                </div>

                <div className='flex gap-3 max-sm:flex-wrap'>

                    <div className="flex w-1/2 max-sm:w-full flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            # Consecutivo <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={CentrosAgg.consecutivo}
                            type="number"
                            name="consecutivo"
                            className={`border-1 h-10 rounded-md px-3 ${errors.consecutivo ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_campo(e)}
                        />
                        {errors.consecutivo && (
                            <div className="text-red-600 text-xs">
                                {errors.consecutivo}
                            </div>
                        )}
                    </div>

                    <div className="flex w-1/2 max-sm:w-full flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Proceso <span className="font-bold text-red-900">*</span>
                        </label>
                        <div className={`card flex justify-content-center border-1 rounded-md ${errors.marca ? "border-red-500" : "border-gray-300"
                            }`}>
                            <Dropdown
                                value={CentrosAgg.id_proceso} onChange={(e) => btn_cambio_campo(e)} options={dataProcesos}
                                name="id_proceso"
                                optionLabel="proceso"
                                optionValue="id_proceso"
                                placeholder="Seleccione"
                                filter className="w-full md:w-14rem rounded-md"
                            />
                        </div>
                        {errors.id_proceso && (
                            <div className="text-red-600 text-xs">
                                {errors.id_proceso}
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="flex gap-3 flex-wrap"> */}
                <div className="flex flex-col">
                    <label className="text-gray-600 pb-2 font-semibold">
                        Responsable <span className="font-bold text-red-900">*</span>
                    </label>
                    <InputText
                        value={CentrosAgg.correo_responsable}
                        type="email"
                        placeholder='correo@example.com'
                        name="correo_responsable"
                        className={`border-1 h-10 rounded-md px-3 ${errors.correo_responsable ? "border-red-500" : "border-gray-300"
                            }`}
                        onChange={(e) => btn_cambio_campo(e)}
                    />
                    {errors.correo_responsable && (
                        <div className="text-red-600 text-xs">
                            {errors.correo_responsable}
                        </div>
                    )}

                </div>
                {/* </div> */}
            </div>
            {/* </div> */}
        </Dialog>
    )
}

export default ModalAgregarCentro