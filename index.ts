import express, { Response } from 'express';
import cors from 'cors';
import { _Usuario_Router } from './src/routes/UsuarioRoutes';
import { resolve } from "path";
import { config } from "dotenv";
import { _PerfilesRouter } from './src/routes/PerfilesRoutes';

const app = express();

config({ path: resolve(__dirname, "./.env") });

const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

// DEFINIR TIPOS PARA EL OBJETO REQUEST
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

//OBTENER LA IP DEL CLIENTE AL REALIZAR ALGUNA ACCIÓN
app.use(async (__, _, next) => {
    const data = await fetch('https://ipinfo.io/json')
    const json = await data.json()
    console.log('------------------------------------------------')
    console.log('IP Cliente: ' + json.ip)
    console.log(`Ubicación: ${json.country} ${json.region}/${json.city}`)
    console.log('Fecha:', new Date(Date.now()))
    console.log('------------------------------------------------')
    next()
});


//DEFINIR RUTA DEL USUARIO
// Crear una instancia del enrutador de usuario
app.use('/suma/api/usuarios', _Usuario_Router);

//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', _PerfilesRouter)

//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res: Response) => {
    res.send({ error: true, message: "Pagína no encontrada" });
})

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});