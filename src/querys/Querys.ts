import { Direccion } from "../Interfaces/IConstants";
import { Database } from "../config/db";
import { _editar_direccion, _insertar_direccion } from "../dao/Daos";

export default class Querys extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }

    public async Insertar_Direccion(direccion_request: Direccion) {
        const client = await this.pool.connect()

        const {
            tipo_via, numero_u, letra_u,
            numero_d, complemento_u, numero_t,
            letra_d, complemento_d, numero_c,
            complemento_f, departamento, municipio
        } = direccion_request

        try {
            let result = await client.query(
                _insertar_direccion,
                [
                    tipo_via, numero_u, letra_u,
                    numero_d, complemento_u, numero_t,
                    letra_d, complemento_d, numero_c,
                    complemento_f, departamento, municipio
                ]
            );
            return result.rows || []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Direccion(id_direccion: number, direccion_request: Direccion) {
        const client = await this.pool.connect()

        const {
            tipo_via, numero_u, letra_u,
            numero_d, complemento_u, numero_t,
            letra_d, complemento_d, numero_c,
            complemento_f, departamento, municipio
        } = direccion_request

        try {
            let result = await client.query(
                _editar_direccion,
                [
                    id_direccion,
                    tipo_via, numero_u, letra_u,
                    numero_d, complemento_u, numero_t,
                    letra_d, complemento_d, numero_c,
                    complemento_f, departamento, municipio
                ]
            );
            return result.rowCount || 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }
}