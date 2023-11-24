import express from 'express';
import cors from 'cors';

import logger from 'morgan'
import { _Recoleccion_IP } from '../middleware/Autorizacion';

//INICIALIZAR EL SERVIDOR CON EXPRESS
const server = express();

// DEFINIR TIPOS PARA EL OBJETO REQUEST
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

// MIDDLEWARES
server.disable('x-powered-by');
server.use(express.json());
server.use(cors());
server.use(logger('dev'))
server.use(_Recoleccion_IP)


const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

export default server
