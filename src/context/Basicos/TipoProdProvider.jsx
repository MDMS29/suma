import { createContext, useMemo } from "react";
const TipoProdContext = createContext();

const TipoProdProvider = ({ children }) => {
    const obj = useMemo(() => ({

    }));

    return (
        <TipoProdContext.Provider
            value={obj}
        >      {children}
        </TipoProdContext.Provider>
    )
}

export { TipoProdProvider }
export default TipoProdContext