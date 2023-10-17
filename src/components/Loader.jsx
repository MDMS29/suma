const Loader = () => {
    return (
        <div className="flex flex-col justify-center">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p>Cargando...</p>
        </div>
    )
}

export default Loader