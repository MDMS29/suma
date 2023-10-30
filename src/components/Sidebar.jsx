import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";

const Sidebar = () => {
  const { cerrar_salir, authModulos, setAuthModulos, authUsuario } = useAuth();

  const { usuario, nombre_empresa } = authUsuario;

  const { pathname } = useLocation()

  const [open, setOpen] = useState(false);

  const setSubMenuOpen = (index) => {
    setAuthModulos((prevModulos) =>
      prevModulos.map((modulos, i) => {
        if (i === index) {
          return { ...modulos, isOpen: !modulos.isOpen };
        }
        return modulos;
      })
    );
  };

  const toggleSidebarAbierto = () => {
    setOpen(!open);
    authModulos.map(modulo => modulo.isOpen === true && !open ? modulo.isOpen = false : modulo.isOpen === true)
  };

  return (
    <div className="flex max-sm:absolute relative z-10">

      <div className="h-screen flex border-r shadow-sm bg-white">

        <div className={` ${open ? "w-auto px-2" : "w-16 max-sm:w-0 z-10"} bg-white overflow-hidden transition-all duration-500 ease-in-out`}>

          <div className={`z-10 absolute ${open ? 'max-sm:left-60 max-sm:top-3  left-60 top-5' : 'max-sm:left-3 max-sm:top-3  left-12 top-5'}`}>
            <button
              className="z-90 bottom-10 right-8 bg-primaryYellow w-10 h-10 rounded-lg drop-shadow-lg flex justify-center items-center hover:bg-amber-500 duration-300"
              onClick={toggleSidebarAbierto}
            >
              <span className="pi pi-bars"></span>
            </button>
          </div>



          <div className="flex p-2 mx-1">
            <img
              src="https://img.freepik.com/vector-premium/avatar-hombre-sonriente-joven-hombre-bigote-barba-marron-cabello-sueter-amarillo-o-sudadera-ilustracion-personaje-personas-vector-3d-estilo-minimalista-dibujos-animados_365941-860.jpg?w=740"
              alt=""
              className="h-10 rounded-md"
            />
            <div className={`flex justify-between items-center w-40 ml-3 mr-4`}>
              <div className={`leading-4 ${!open && "invisible"}`}>
                <h4 className=" font-semibold">{usuario}</h4>
                <span className=" text-xs text-gray-600 overflow-hidden">
                  {nombre_empresa}
                </span>
              </div>
            </div>
            <div
              onClick={cerrar_salir}
              className={`${open ? 'w-52' : 'w-9'}  min-sm:${open ? 'flex absolute ' : 'hidden'} md:absolute p-2 m-2 mx-3 overflow-hidden hover:bg-primaryYellow  inset-x-0 bottom-5 flex rounded-md cursor-pointer font-semibold hover:bg-amarillo text-sm`}
            >
              <i className="pi pi-sign-out"></i>
              {open && <span className="ml-2">SALIR</span>}
            </div>
          </div>
          <ul >
            {authModulos.map((modulo, index) => (
              <div key={modulo.nombre_modulo}>
                <li
                  onClick={() => setSubMenuOpen(index)}
                  className={`${pathname.includes(modulo.nombre_modulo.toLowerCase()) && 'bg-primaryYellow'} flex font-semibold rounded-md p-2 mx-2 cursor-pointer hover:bg-primaryYellow text-sm justify-center gap-x-4 ${modulo.gap ? "mt-9" : "mt-2"}`}
                >
                  <div>
                    {modulo.icono ? (
                      <i className={`pi ${modulo.icono}`}></i>
                    ) : (
                      <i className="pi pi-inbox"></i>
                    )}
                  </div>
                  {open && <span>{modulo.nombre_modulo}</span>}

                  {open && modulo.menus && (
                    <i
                      className={`pi pi-angle-down ml-auto ${modulo.isOpen && "rotate-180"
                        } `}
                    ></i>
                  )}
                </li>

                {modulo.menus && modulo.isOpen && open && (
                  <ul className="bg-slate-100 m-2 py-0.5 rounded-md">
                    {modulo.menus.map((subMenuItem) => (
                      <Link
                        to={subMenuItem.link_menu}
                        key={subMenuItem.link_menu}
                        className={`${pathname.includes(subMenuItem.nombre_menu.toLowerCase()) && 'bg-gray-300'} flex text-black p-4 my-2 rounded-md cursor-pointer text-center hover:bg-gray-300 text-sm py-1`}
                        onClick={() => setOpen(false)}
                      >
                        {subMenuItem.nombre_menu}
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;