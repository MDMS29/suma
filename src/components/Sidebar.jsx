import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";

const Sidebar = () => {
  const {
    cerrar_salir,
    authModulos,
    setAuthModulos,
    authUsuario,
    open,
    setOpen,
  } = useAuth();

  const { usuario, nombre_empresa } = authUsuario;

  const { pathname } = useLocation();

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
    authModulos.map((modulo) =>
      modulo.isOpen === true && !open
        ? (modulo.isOpen = false)
        : modulo.isOpen === true
    );
  };

  return (
    <div className="flex max-sm:absolute relative z-10">
      <div className="h-screen flex border-r shadow-sm bg-white">
      <div
          className={` ${
            open ? "w-auto px-2" : "w-16 max-sm:w-0 z-10"
          } bg-white overflow-y-auto scrollbar-hidden transition-all duration-500 ease-in-out`}
          style={{ maxHeight: "100%" }}
        >
          <div
            className={`z-10 absolute ${
              open
                ? "max-sm:left-60 max-sm:top-3 left-60 top-5 xl:hidden lg:hidden md:hidden"
                : "hidden "
            }`}
          >
            <button
              onClick={toggleSidebarAbierto}
              className="z-90 bottom-10 right-8 bg-primaryYellow w-10 h-10 rounded-lg drop-shadow-lg flex justify-center items-center hover:bg-amber-500 duration-300"
            >
              <span className="pi pi-bars"></span>
            </button>
          </div>

          <div className="flex p-2 mx-1">
            <img
              src="/src/img/logo-suma.jpeg"
              alt="Logo SUMA"
              className="h-10 rounded-full"
            />
            <div className={`flex justify-between items-center w-40 ml-3 mr-4`}>
              <div className={`leading-4 ${!open && "invisible"}`}>
                <h4 className=" font-semibold">{usuario}</h4>
                <span className=" text-xs text-gray-600 overflow-hidden">
                  {nombre_empresa}
                </span>
              </div>
            </div>
          </div>
          <ul>
            {authModulos.map((modulo, index) => (
              <div key={modulo.nombre_modulo}>
                <li
                  onClick={() => setSubMenuOpen(index)}
                  className={`${
                    pathname.includes(modulo.nombre_modulo.toLowerCase()) &&
                    "bg-primaryYellow"
                  } flex font-semibold rounded-md p-2 mx-2 cursor-pointer hover:bg-primaryYellow text-sm justify-center gap-x-4 ${
                    modulo.gap ? "mt-9" : "mt-2"
                  }`}
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
                      className={`pi pi-angle-down ml-auto ${
                        modulo.isOpen && "rotate-180"
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
                        className={`${
                          pathname.includes(
                            subMenuItem.nombre_menu.toLowerCase()
                          ) && "bg-gray-300"
                        } flex text-black p-4 my-2 rounded-md cursor-pointer text-center hover:bg-gray-300 text-sm py-1`}
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
    </div>
  );
};

export default Sidebar;
