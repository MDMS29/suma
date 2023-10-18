import { BrowserRouter } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";

import { AuthProvider } from "./context/AuthProvider.jsx";
import { UsuariosProvider } from "./context/UsuariosProvider.jsx";
import { PerfilesProvider } from "./context/PerfilesProvider.jsx";
import { ModulosProvider } from "./context/ModulosProvider.jsx";

import AppMain from "./router/AppMain.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PrimeReactProvider>
          <UsuariosProvider>
            <PerfilesProvider>
              <ModulosProvider>
                <AppMain />
              </ModulosProvider>
            </PerfilesProvider>
          </UsuariosProvider>
        </PrimeReactProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
