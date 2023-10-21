import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const BLink = ({ children, url, tipo }) => {

    const estilos = {
        INACTIVOS: "px-4 p-2 mx-2 rounded-md text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out",
        BASIC: "text-primaryYellow underline hover:text-yellow-700 transition-colors text-center cursor-pointer"
    }

    return (

        <Link to={url} className={estilos[tipo]}>
            {children}
        </Link>
    )
}

export default BLink