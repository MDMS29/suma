import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";
import { InputText } from "primereact/inputtext";
import useIva from "../../../../hooks/Basicos/useIva";
import useAuth from "../../../../hooks/useAuth";

const ModalAgregarIva = ({ visible, onClose }) => {

    const { ivaAgg, setIvaAgg, errors, setErrors, guardar_iva, editar_iva } = useIva()
    const { authUsuario } = useAuth()

    const cerrar_modal = () => {
        onClose();
        setIvaAgg({
            id_empresa: authUsuario.id_empresa,
            id_iva: 0,
            descripcion: "",
            porcentaje: 0
        })
        setErrors({});
    };

    const btn_guardar = async () => {
        const formData = {
            id_empresa: authUsuario.id_empresa,
            id_iva: ivaAgg.id_iva,
            descripcion: ivaAgg.descripcion,
            porcentaje: Number(ivaAgg.porcentaje)
        }

        const regex = /^[a-zA-Z0-9\s]*$/;
        const codigoRegex = /^[0-9]*$/;
        const errors = {};

        if (ivaAgg.descripcion.length < 5) {
            errors.descripcion = "Este campo debe tener minimo 5 caracteres";
            setErrors(errors);
            return
        }
        if (!ivaAgg.descripcion) {
            errors.descripcion = "Este campo es obligatorio";
            setErrors(errors);
            return
        }
        if (!regex.test(ivaAgg.descripcion)) {
            errors.descripcion = "No se permiten caracteres especiales"
            setErrors(errors);
            return;
        }
        if (!codigoRegex.test(ivaAgg.porcentaje)) {
            errors.porcentaje = "Este campo es obligatorio";
            setErrors(errors);
            return
        }
        try {
            let response;
            if (ivaAgg.id_iva !== 0) {
                response = await editar_iva(formData);
            } else {
                response = await guardar_iva(formData);

            }

            if (response) {
                cerrar_modal()
            }

        } catch (error) {
            console.error("Error al guardar el IVA:", error);
        }
        setErrors({});
    }

    const btn_cambio_iva = (e) => {
        const value = e.target.value;
        setIvaAgg({ ...ivaAgg, [e.target.name]: e.target.name == "descripcion" ? value.replace(/\d/g, '') : value });
    };

    const footerContent = (
        <div>
            <Button
                tipo={'PRINCIPAL'}
                funcion={btn_guardar}
            > {ivaAgg.id_iva !== 0 ? 'Actualizar' : 'Guardar'}
            </Button>
        </div>
    );

    return (
        <Dialog
            header={ivaAgg.id_iva !== 0 ? <h1>Editar IVA</h1> : <h1>Agregar IVA</h1>}
            visible={visible}
            onHide={cerrar_modal}
            className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
            footer={footerContent}
        >
            <div className="flex flex-col pt-3 flex-wrap w-full">
                <div className="grid gap-4 w-full">
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Descripcion <span className="font-bold text-red-900">*</span>
                        </label>
                        <InputText
                            value={ivaAgg.descripcion}
                            type="text"
                            name="descripcion"
                            className={`border-1 h-10 rounded-md px-3 py-2 ${errors.descripcion ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_iva(e)}
                        />
                        {errors.descripcion && (
                            <div className="text-red-600 text-xs">
                                {errors.descripcion}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">
                            Porcentaje <span className="font-bold text-red-900">*</span>
                        </label>
                        <div className="p-inputgroup flex-1">
                            <InputText
                                value={ivaAgg.porcentaje}
                                type="number"
                                name="porcentaje"
                                className={`border-1 h-10 rounded-l-lg px-3 ${errors.porcentaje ? "border-red-500" : "border-gray-300"
                                    }`}
                                onChange={(e) => btn_cambio_iva(e)}
                            />
                            <span className="p-inputgroup-addon rounded-r-lg">%</span>
                        </div>
                        {errors.porcentaje && (
                            <div className="text-red-600 text-xs">
                                {errors.porcentaje}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ModalAgregarIva