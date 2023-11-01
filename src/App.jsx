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
                    <MarcasProvider>
                      <UnidadesProvider>
                        <FamiliaProdProvider>
                          <TipoProdProvider>
                            <ProcesosProvider>
                              <AppMain />
                            </ProcesosProvider>
                          </TipoProdProvider>
                        </FamiliaProdProvider>
                      </UnidadesProvider>
                    </MarcasProvider>
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
