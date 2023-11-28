import { BrowserRouter } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";

import { AuthProvider } from "./context/AuthProvider.jsx";
import { UsuariosProvider } from "./context/Configuracion/UsuariosProvider.jsx";
import { PerfilesProvider } from "./context/Configuracion/PerfilesProvider.jsx";
import { ModulosProvider } from "./context/Configuracion/ModulosProvider.jsx";
import { MarcasProvider } from "./context/Basicos/MarcasProvider.jsx";
import { UnidadesProvider } from "./context/Basicos/UnidadesProvider.jsx";
import { FamiliaProdProvider } from "./context/Basicos/FamiliaProdProvider.jsx";
import { TipoProdProvider } from "./context/Basicos/TipoProdProvider.jsx";

import AppMain from "./router/AppMain.jsx";
import { RolesProvider } from "./context/Configuracion/RolesProvider.jsx";
import { EmpresasProvider } from "./context/EmpresasProvider.jsx";
import { ProcesosProvider } from "./context/Basicos/ProcesosProvider.jsx";
import { CentrosProvider } from "./context/Basicos/CentrosProvider.jsx";
import { ProductosProvider } from "./context/Basicos/ProductosProvider.jsx";
import { RequisicionesProvider } from "./context/Compras/RequisicionesProvider.jsx";
import { ProveedoresProvider } from "./context/Compras/ProveedoresProvider.jsx";
import {HistorialProvider} from "./context/Auditorias/HistorialProvider.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <PrimeReactProvider>
        <AuthProvider>
          <EmpresasProvider>
            <UsuariosProvider>
              <PerfilesProvider>
                <ModulosProvider>
                  <RolesProvider>
                    <ProductosProvider>
                      <MarcasProvider>
                        <UnidadesProvider>
                          <FamiliaProdProvider>
                            <TipoProdProvider>
                              <ProcesosProvider>
                                <CentrosProvider>
                                  <RequisicionesProvider>
                                    <ProveedoresProvider>
                                      <HistorialProvider>
                                        <AppMain />
                                      </HistorialProvider>
                                    </ProveedoresProvider>
                                  </RequisicionesProvider>
                                </CentrosProvider>
                              </ProcesosProvider>
                            </TipoProdProvider>
                          </FamiliaProdProvider>
                        </UnidadesProvider>
                      </MarcasProvider>
                    </ProductosProvider>
                  </RolesProvider>
                </ModulosProvider>
              </PerfilesProvider>
            </UsuariosProvider>
          </EmpresasProvider>
        </AuthProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  );
};

export default App;
