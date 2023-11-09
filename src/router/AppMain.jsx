import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";

import rutas_usuario from "./routes.jsx";
import AuthRoutes from "./AuthRoutes.jsx";
import ErrorRoutes from "./ErrorRoutes.jsx";

import Home from "../Pages/Home.jsx";
import Layout from "../layout/Layout.jsx";
import AuthLayouth from "../layout/AuthLayouth.jsx";

let rutas = [];

const obtenerRutas = (menu) => {
  let rutasIncluidas = rutas_usuario.filter((ruta) =>
    ruta.route.includes(menu.link_menu)
  );
  return rutasIncluidas;
};

const AppMain = () => {
  const { authModulos } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  //CARGAR LAS RUTAS DEL USUARIO
  useEffect(() => {
    const nuevasRutas = [];
    authModulos.forEach((modulo) => {
      modulo.menus.forEach((menu) => {
        nuevasRutas.push(...obtenerRutas(menu));
      });
    });

    rutas = nuevasRutas;
  }, [authModulos]);


  //VERIFICACION DE RUTAS
  useEffect(() => {
    if (rutas_usuario.filter(ruta => ruta.route === location.pathname).length === 0) {
      if (location.pathname !== 'error/no-encontrada') {
        return navigate('error/no-encontrada')
      } else {
        return
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Routes>
      {/* Area Autenticacion */}
      <Route path="/auth" element={<AuthLayouth />}>
        {AuthRoutes.map((ruta) => (
          <Route exact path={ruta?.route} element={ruta?.component} key={ruta?.key} />
        ))}
      </Route>


      {/* Area Privada */}
      <Route path="/" element={<Layout />}>
          

        <Route path="home" element={<Home />} />
        {rutas.map((ruta) => (
          <Route
            exact
            path={ruta?.route}
            element={ruta?.component}
            key={ruta?.key}
          />
        ))}

        {/* CARGAR LAS POSIBLES RUTAS DE ERRORES */}
        {ErrorRoutes.map((ruta) => (
          <Route
            exact
            path={ruta?.route}
            element={ruta?.component}
            key={ruta?.key}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppMain;
