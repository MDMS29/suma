import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <section className="flex flex-col justify-center">
            <p className="w-full text-center text-6xl">
                <i className="pi pi-ban text-6xl  text-primaryYellow"></i> 404
            </p>
            <div className="mt-4">
                <h1 className="text-center mb-3">¡Pagina no encontrada!</h1>
                <p className="text-center p-2">Lo sentimos pero esta pagina no existe.</p>
                <p className="text-center p-2 text-gray-400">ERR_NOT_FOUND</p>
                <div className="w-full text-center">
                    <Link to="/home" className='text-primaryYellow underline hover:text-secundaryYellow text-center cursor-pointer'>
                        Volver
                    </Link>
                </div>
            </div>
        </section >
    )
}

export default NotFound