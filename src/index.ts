import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import { AppRoutes } from './routes/App.Routes';
import { ConfigServer } from './config/config';

declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

class ServerControl extends ConfigServer {
    public app: express.Application = express();
    private port: number = this.getNumberEnv('PORT') ?? 3000

    constructor() {
        super()
        this.app.disable('x-powered-by');
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(morgan('dev'));

        this.app.use('/suma/api', this.routers())
        this.app.use((_, res) => res.status(404).json({ error: true, code: 404, message: "No se ha encontrado la request" }))
        this.listen()

    }

    routers(): Array<express.Router> {
        return AppRoutes
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor en ejecución en el puerto ${this.port}`);
        });
    }
}

new ServerControl()
