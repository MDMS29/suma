import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import Button from '../../../Botones/Button';
import useProcesos from '../../../../hooks/Basicos/useProcesos';
import useAuth from '../../../../hooks/useAuth';


const ModalAgregarProcesos = ({ visible, onClose }) => {
    const { procesosAgg, setProcesosAgg, errors, setErrors, guardar_proceso, editar_proceso } = useProcesos()
     const { authUsuario } = useAuth()

    const btn_guardar = async () => {
        const formData = {
            id_empresa: authUsuario.id_empresa,
            id_proceso: procesosAgg.id_proceso,
            codigo: procesosAgg.codigo,
            proceso: procesosAgg.proceso
        }

        const regex = /^[a-zA-Z0-9\s]*$/;
        const errors = {};
        const codigoRegex = /^[0-9]*$/;

        if (!procesosAgg.codigo) {
            errors.codigo = "El código es obligatorio";
            setErrors(errors);
            return
        }
        if (!codigoRegex.test(procesosAgg.codigo)) {
            errors.codigo = "El código debe contener solo dígitos";
            setErrors(errors);
            return
        }
        if (procesosAgg.codigo.length > 3) {
            errors.codigo = "El código solo puede tener 3 dígitos";
            setErrors(errors);
            return
        }
        if (procesosAgg.proceso.trim() === '') {
            errors.proceso = "Este campo es obligatorio"
            setErrors(errors);
            return
        }
        if (!regex.test(procesosAgg.proceso)) {
            errors.proceso = "No se permiten caracteres especiales";
            setErrors(errors);
            return
        }

        try {
            let response;
            if (procesosAgg.id_proceso !== 0) {
                response = await editar_proceso(formData);
            } else {
                response = await guardar_proceso(formData);
            }

            if (response) {
                onClose();
                setErrors({});
            }

        } catch (error) {
            console.error("Error al guardar el Proceso:", error);
        }
        setErrors({});

    }

    const cerrar_modal = () => {
        onClose();
        setProcesosAgg({
            id_empresa: authUsuario.id_empresa,
            id_proceso: 0,
            codigo: "",
            proceso: ""
        });
        setErrors({});
    };

    const btn_cambio_proceso = (e) => {
        const value = e.target.value;
        setProcesosAgg({ ...procesosAgg, [e.target.name]: e.target.name == "proceso" ? value.replace(/\d/g, '') : value });
    };

    const footerContent = (
        <div>
            <Button
                tipo={'PRINCIPAL'}
                funcion={btn_guardar}
            > {procesosAgg.id_proceso !== 0 ? 'Actualizar' : 'Guardar'}
            </Button>
        </div>
    );

    return (
        <Dialog
            header={procesosAgg.id_proceso !== 0 ? <h1>Editar Proceso</h1> : <h1>Agregar Proceso</h1>}
            visible={visible}
            onHide={cerrar_modal}
            className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
            footer={footerContent}
        >
            <div className="flex flex-col pt-3 flex-wrap w-full">
                <div className="grid gap-4 w-full">
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Codigo <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={procesosAgg.codigo}
                            type="text"
                            name="codigo"
                            className={`border-1 h-10 rounded-md px-3 ${errors.codigo ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_proceso(e)}
                        />
                        {errors.codigo && (
                            <div className="text-red-600 text-xs">
                                {errors.codigo}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Nombre <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={procesosAgg.proceso}
                            type="text"
                            name="proceso"
                            className={`border-1 h-10 rounded-md px-3 ${errors.proceso ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_proceso(e)}
                        />
                        {errors.proceso && (
                            <div className="text-red-600 text-xs">
                                {errors.proceso}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ModalAgregarProcesos