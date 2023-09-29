import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { _UsuarioRouter } from './src/routes/UsuarioRoutes';
// import { UsuarioLogeado } from './src/validations/Types';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

app.get('/', (_, res: Response) => {
    res.send('Hello World!');
});

app.use('/suma/api/usuarios', _UsuarioRouter);

app.use((_, res: Response) => {
    res.status(404).send({ message: "Pagína no encontrada" });
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