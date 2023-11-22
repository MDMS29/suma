// eslint-disable-next-line react/prop-types
const Button = ({ children, tipo, funcion }) => {

    const estilos = {
        PRINCIPAL: "bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500 font-semibold",
        CANCELAR: "px-4 p-2 mx-2 rounded-md font-semibold bg-neutralGray hover:bg-hoverGray transition duration-300 ease-in-out",
        EXPORTAR: "px-4 p-2 mx-2 rounded-md font-semibold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out gap-2 flex place-items-center",
        FILTRAR: "px-4 p-2 mx-2 rounded-md font-semibold bg-neutralGray hover:bg-hoverGray transition duration-300 ease-in-out gap-2 flex place-items-center",
        CANCELAR_FILTRO: "p-2 rounded-md font-semibold bg-red-200 hover:bg-red-300",
    }

    return (
        <button className={estilos[tipo]} onClick={funcion}>
            {children}
        </button>
    )
}

export default Button