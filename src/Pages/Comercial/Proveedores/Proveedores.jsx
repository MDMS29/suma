import BLink from "../../../components/Botones/BLink"
import { Add_Icono } from "../../../components/Icons/Iconos"

const Proveedores = () => {
    const main = () => (
        <div className="w-5/6">
            <div className="flex justify-center gap-x-4 m-2 p-3">
                <h1 className="text-3xl">Perfiles</h1>
                <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
            </div>
            <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
                <div className="h-full flex justify-center items-center">
                    <div className="h-full flex justify-center items-center">
                        <div className="h-full flex justify-center items-center">
                            <BLink
                                tipo={"PRINCIPAL"}
                                url={"/compras/proveedores/agregar"}
                            >
                                {Add_Icono} Agregar
                            </BLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

    return (
        <>{main()}</>
    )
}

export default Proveedores