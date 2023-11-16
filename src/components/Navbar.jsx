import useAuth from "../hooks/useAuth.jsx";
import { useEffect, useRef, useState } from 'react';

import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

import { Tree } from 'primereact/tree';


export default function Navbar() {

    const op = useRef(null);
    const campana = useRef(null);
    const { cerrar_salir, authModulos, open, setOpen } = useAuth();

    const [nodes, setNodes] = useState([]);

    const NodeService = {
        getTreeNodesData() {
            return [
                {
                    key: '0',
                    label: 'Perfil',
                    data: 'Account Settings',
                    icon: 'pi pi-user-edit',
                    className: "flex justify-start pr-20 hover:bg-gray-300 rounded-md cursor-pointer"
                },
                {
                    key: '1',
                    label: 'Cambiar contraseña',
                    data: 'Change Password',
                    icon: 'pi pi-arrow-right-arrow-left',
                    className: "hover:bg-gray-300 rounded-md cursor-pointer"
                },
                {
                    key: '2',
                    label: 'Salir',
                    data: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    className: "hover:bg-gray-300 rounded-md cursor-pointer"
                }
            ];
        },
        getTreeNodes() {
            return Promise.resolve(this.getTreeNodesData());
        }
    };

    const toggleSidebarAbierto = () => {
        setOpen(!open);
        authModulos.map(modulo => modulo.isOpen === true && !open ? modulo.isOpen = false : modulo.isOpen === true)
    };

    const nodo_click = (event) => {
        const clickedNodeKey = event.node.key;
        if (clickedNodeKey == 2) {
            cerrar_salir()
        }
        // console.log('Node clicked:', event.node);
    }

    useEffect(() => {
        NodeService.getTreeNodes().then((data) => setNodes(data));
    }, []);


    return (
        <div className="h-16 bg-white flex items-center justify-between  shadow-sm">
            <div className="ml-5">
                <button onClick={toggleSidebarAbierto}
                    className="z-90 bottom-10 right-8 bg-primaryYellow w-10 h-10 rounded-lg flex justify-center items-center hover:bg-secundaryYellow duration-300"
                > <span className="pi pi-bars"></span></button>
            </div>
            <div className="flex gap-4 items-center">
                <div>
                    <Button onClick={(e) => campana.current.toggle(e)}>
                        <i className="pi pi-bell text-xl"></i>
                    </Button>
                </div>

                <OverlayPanel ref={campana}>
                    <h3 className="text-center pb-2 border-b">Notificaciones</h3>
                    <div className="text-center px-3 my-2">
                        <i className="pi pi-spin pi-sync text-xl py-2"></i>
                        <h1>En construcción...</h1>
                    </div>
                </OverlayPanel>

                <div className="bg-primaryYellow hover:bg-secundaryYellow rounded-full p-1 mr-5">

                    <Button type="button" className="gap-3 focus:outline-none focus:ring-2 focus:ring-secundaryYellow focus:rounded-full" onClick={(e) => op.current.toggle(e)}>
                        <img src="https://img.freepik.com/vector-premium/avatar-hombre-sonriente-joven-hombre-bigote-barba-marron-cabello-sueter-amarillo-o-sudadera-ilustracion-personaje-personas-vector-3d-estilo-minimalista-dibujos-animados_365941-860.jpg?w=740" alt="logo personal"
                            className="h-8 rounded-full" />
                        <i className="pi pi-cog text-xl mr-2"></i>
                    </Button>

                    <OverlayPanel ref={op} className={open && "max-sm:hidden"}
                    >
                        <Tree value={nodes} onNodeClick={nodo_click} className="w-full md:w-30rem p-0" />
                    </OverlayPanel>
                </div>
            </div>
        </div>
    )
}
