
import { Menubar } from 'primereact/menubar';
import useAuth from "../hooks/useAuth.jsx";


export default function Navbar() {
    const { cerrar_salir, authModulos, open, setOpen } = useAuth();

    const customMenuItem = (item) => {
        return (
            <div className="custom-menu-item">
                {item.icon && <img src={item.icon} alt={item.label} className="menu-icon" />}
                <span className="menu-label">{item.label}</span>
            </div>
        );
    };

    const toggleSidebarAbierto = () => {
        setOpen(!open);
        authModulos.map(modulo => modulo.isOpen === true && !open ? modulo.isOpen = false : modulo.isOpen === true)
    };

    const items = [
        {
            label: 'File',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Perfil',
                    icon: 'pi pi-user-edit'

                },
                {
                    label: 'Salir',
                    icon: 'pi pi-sign-out',
                    command: (event) => cerrar_salir(event),

                }
            ]
        }
    ];


    const start = (
        <button onClick={toggleSidebarAbierto}
            className="z-90 bottom-10 right-8 bg-primaryYellow w-10 h-10 rounded-lg flex justify-center items-center hover:bg-amber-500 duration-300"
        > <span className="pi pi-bars"></span></button>)


    const end = (<div>
        <img
            src="https://img.freepik.com/vector-premium/avatar-hombre-sonriente-joven-hombre-bigote-barba-marron-cabello-sueter-amarillo-o-sudadera-ilustracion-personaje-personas-vector-3d-estilo-minimalista-dibujos-animados_365941-860.jpg?w=740"
            alt=""
            className="h-10 rounded-full"
        />

        <div onClick={cerrar_salir}>
            <i className="pi pi-sign-out"></i>
            <span className='ml-2'>SALIR</span>
        </div>
    </div>)

    return (
        <div className="card">
            <Menubar model={items} end={end} start={start} />
        </div>
    )
}
