import express, { Response } from 'express';
import cors from 'cors';
import { _UsuarioRouter } from './src/routes/UsuarioRoutes';
import { resolve } from "path";
import { config } from "dotenv";

const app = express();

config({ path: resolve(__dirname, "./.env") });

const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

//OBTENER LA IP DEL CLIENTE AL REALIZAR ALGUNA ACCIÓN
app.use(async (req, _, next) => {
    const data = await fetch('https://ipinfo.io/json')
    const json = await data.json()
    console.log('------------------------------------------------')
    console.log('IP Cliente: ' + json.ip)
    console.log('IP Acceso remoto: ' + req.socket.remoteAddress)
    console.log('Fecha:', new Date(Date.now()))
    console.log('------------------------------------------------')
    next()
});

//DEFINIR RUTA DEL USUARIO
app.use('/suma/api/usuarios', _UsuarioRouter);

//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res: Response) => {
    res.send({ error: true, message: "Pagína no encontrada" });
})

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

// DEFINIR TIPOS PARA EL OBJETO REQUEST
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}