import { createContext, useMemo } from "react";

const ProveedoresContext = createContext();

const ProveedoresProvider = ({ children }) => {

    const obj = useMemo(() => ({}))

    return (
        <ProveedoresContext.Provider
            value={obj}>
            {children}
        </ProveedoresContext.Provider>
    )
}

export { ProveedoresProvider }
export default ProveedoresContext