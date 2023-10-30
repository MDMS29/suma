import { createContext, useMemo } from "react";
const CentrosContext = createContext();

const CentrosProvider = ({ children }) => {

    const obj = useMemo(() => ({
        
    }));

    return (
        <CentrosContext.Provider
            value={obj}
        >      {children}
        </CentrosContext.Provider>
    )
}

export { CentrosProvider };
export default CentrosContext;