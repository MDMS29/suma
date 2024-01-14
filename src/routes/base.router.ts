import { Router } from "express"

export class BaseRouter<T>{
    public router: Router
    public controller: T
    public subcarpeta: string

    constructor(TController: { new(): T }, SubCarpeta: string) {
        this.router = Router()
        this.controller = new TController()
        this.subcarpeta = SubCarpeta

        this.routes() //EJECUTAR LAS RUTAS
    }

    routes() { }
}