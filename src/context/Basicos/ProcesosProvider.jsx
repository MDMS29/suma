import { createContext, useMemo } from "react";
const ProcesosContext = createContext();

const ProcesosProvider = ({ children }) => {

    const obj = useMemo(() => ({
        
    }));

    return (
        <ProcesosContext.Provider
            value={obj}
        >      {children}
        </ProcesosContext.Provider>
    )
}

export { ProcesosProvider };
export default ProcesosContext;