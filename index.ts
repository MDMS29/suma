import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { _UsuarioRouter } from './src/routes/UsuarioRoutes';

const app = express();

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());


//TODO: CONSEGUIR IP DEL CLIENTE
app.use(async (req, _, next) => {
    const data = await fetch('https://ipinfo.io/json')
    const json = await data.json()
    console.log('IP Cliente: ' + json.ip)
    console.log('IP Acceso remoto: ' + req.socket.remoteAddress)
    console.log('Fecha:', new Date(Date.now()))
    next()
});


app.use('/suma/api/usuarios', _UsuarioRouter);

app.use((_, res: Response) => {
    res.send({ error: true, message: "Pagína no encontrada" });
})

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

// Definir tipos para el objeto Request
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}