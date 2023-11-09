import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const BLink = ({ children, url, tipo }) => {

    const estilos = {
        INACTIVOS: "px-4 p-2 mx-2 rounded-md text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out font-semibold",
        BASIC: "text-primaryYellow underline hover:text-yellow-700 transition-colors text-center cursor-pointer",
        PRINCIPAL: "bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500 font-semibold hover:text-gray-700",
        APROBADO: "px-4 p-2 mx-2 rounded-md text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white transition duration-300 ease-in-out font-semibold",
        PENDIENTE:"px-4 p-2 mx-2 rounded-md text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out font-semibold"
    }

    return (

        <Link to={url} className={estilos[tipo]}>
            {children}
        </Link>
    )
}

export default BLink