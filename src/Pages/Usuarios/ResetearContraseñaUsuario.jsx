import useUsuarios from '../../hooks/useUsuarios'
import useAuth from '../../hooks/useAuth'
import { useRef, useState } from "react";
import { Toast } from 'primereact/toast';


const ResetearContraseñaUsuario = () => {

    const { restablecerContraseñaProvider, contraseña, setConstraseña } = useUsuarios()
    const { cerrar_salir } = useAuth()
    const [repContraseña, setRepContraseña] = useState("")
    const toast = useRef(null);

    const validar = () => {
        if ([contraseña, repContraseña].includes("")) {
            return "Campos vacios"
        } if (contraseña !== repContraseña) {
            return "Las contraseñas no coinciden."
        }
    }

    const mensajeCambioContraseña = () => {
        toast.current.show({ severity: "success", detail: "La constraseña se restablecido correctamente.", life: 1500 });
    }
    const mensajeErrorCambioContraseña = () => {
        toast.current.show({ severity: "error", detail: validar(), life: 1500 });
    }

    const restablecerContraseña = (e) => {
        e.preventDefault()
        if (contraseña !== repContraseña) {
            mensajeErrorCambioContraseña()
        } else {
            restablecerContraseñaProvider()
            mensajeCambioContraseña()
            setTimeout(() => {
                cerrar_salir()
            }, 2000);
        }
        setConstraseña("")
        setRepContraseña("")
    }

    const cerrarSesion = () => {
        cerrar_salir()
    }

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Toast ref={toast} />
            <div className="bg-white w-full sm:w-full md:w-1/2 h-auto flex items-center flex-col py-5 rounded-lg shadow-xl flex-wrap">
                <h1 className="text-2xl font-semibold">Resetear <span className="text-primaryYellow">contraseña</span></h1>
                <br />
                <p className="text-gray-500">Ingrese una nueva contraseña </p>

                <form className="flex flex-col gap-3 pt-4 w-2/4">

                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        onChange={(e) => setConstraseña(e.target.value)}
                        value={contraseña}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        onChange={(e) => setRepContraseña(e.target.value)}
                        value={repContraseña}
                    />
                    <input onClick={restablecerContraseña} type="submit" className="mt-3 p-2 mx-2 rounded-md font-semibold
                bg-secundaryYellow hover:bg-primaryYellow transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-200" />

                    <div className='text-gray-500 flex w-100 items-center gap-3'>
                        <hr className='w-100' />
                        <span>o</span>
                        <hr className='w-100' />
                    </div>
                    <a onClick={cerrarSesion} className='text-primaryYellow hover:underline hover:text-secundaryYellow text-center cursor-pointer'>  Ingresar desde una cuenta diferente</a>
                </form>
            </div>
        </div>
    )
}

export default ResetearContraseñaUsuario