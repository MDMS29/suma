import { createContext, useMemo } from "react";
const FamiliaProdContext = createContext();


const FamiliaProdProvider = ({ children }) => {
    const obj = useMemo(() => ({

    }));
    return (
        <FamiliaProdContext.Provider
            value={obj}
        >      {children}
        </FamiliaProdContext.Provider>
    )
}

export { FamiliaProdProvider }
export default FamiliaProdContext