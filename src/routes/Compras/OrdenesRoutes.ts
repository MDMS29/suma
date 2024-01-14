import {_Autorizacion} from "../../middleware/Autorizacion";
import OrdenesController from "../../controller/Compras/OrdenesController";
import {BaseRouter} from "../base.router";

export class OrdenesRouter extends BaseRouter<OrdenesController> {
    constructor() {
        super(OrdenesController, "compras/ordenes")
    }

    routes(): void {
         this.router.route(`/${this.subcarpeta}/:id_orden/enviar-correo-proveedor`)
             .post(_Autorizacion, (req,res) => this.controller.Enviar_Correo_Aprobacion_Proveedor(req,res)) //ENVIAR EL CORREO DE PEDIDO AL PROVEEDOR

         this.router.route(`/${this.subcarpeta}/filtrar`)
             .post(_Autorizacion, (req,res) => this.controller.Obtener_Ordenes_Filtro(req,res)) //OBTENER TODOS LAS REQUISICIONES

         this.router.route(`/${this.subcarpeta}/doc/:id_orden`)
             .get(_Autorizacion, (req,res) => this.controller.Generar_Documento_Orden(req,res)) //GENERAR DOCUMENTOS PDF

         this.router.route(`/${this.subcarpeta}/aprobar/:id_orden_aprobar`)
             .patch(_Autorizacion, (req,res) => this.controller.Aprobar_Orden(req,res)) //APROBAR UNA ORDEN POR EL ID DE UNA ORDEN

         this.router.route(`/${this.subcarpeta}`)
             .get(_Autorizacion, (req,res) => this.controller.Obtener_Ordenes(req,res)) //OBTENER TODAS LAS ORDENES
             .post(_Autorizacion, (req,res) => this.controller.Insertar_Orden(req,res)) //INSERTAR UNA ORDEN


         this.router.route(`/${this.subcarpeta}/:id_orden`)
             .get(_Autorizacion, (req,res) => this.controller.Buscar_Orden(req,res)) //BUSCAR UNA ORDEN POR SU ID
             .patch(_Autorizacion, (req,res) => this.controller.Editar_Orden(req,res)) //EDITAR UNA ORDEN POR SU ID
             .delete(_Autorizacion, (req,res) => this.controller.Eliminar_Restaurar_Orden(req,res)) //ELIMINAR O RESTAURAR UNA ORDEN POR SU ID
    }
}