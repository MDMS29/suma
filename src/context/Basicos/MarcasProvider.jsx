import { createContext, useMemo } from "react";
const MarcasContext = createContext();

const MarcasProvider = ({ children }) => {

    const obj = useMemo(() => ({

    }));

    return (
        <MarcasContext.Provider
            value={obj}
        >      {children}
        </MarcasContext.Provider>
    )
}

export { MarcasProvider };
export default MarcasContext;