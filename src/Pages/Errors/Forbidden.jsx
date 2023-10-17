

const Forbidden = () => {
    return (
        <section className="flex flex-col justify-center">
            <p className="w-full text-center text-6xl">
                <i className="pi pi-lock text-6xl  text-primaryYellow"></i> 403
            </p>
            <div className="mt-4">
                <h1 className="text-center mb-4">¡Acceso denegado!</h1>
                <p className="text-center p-2">Consulte con el administrador del sitio si cree que se trata de un error.</p>
            </div>
        </section>
    )
}

export default Forbidden