"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const UsuarioRoutes_1 = require("./src/routes/UsuarioRoutes");
const PerfilesRoutes_1 = require("./src/routes/PerfilesRoutes");
const ModulosRoutes_1 = require("./src/routes/ModulosRoutes");
const RolesRoutes_1 = require("./src/routes/RolesRoutes");
const MenuRoutes_1 = require("./src/routes/MenuRoutes");
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//VER LAS ACCIONES QUE REALIZA EL USUARIO
app.use((0, morgan_1.default)('dev'));
//OBTENER LA IP DEL CLIENTE AL REALIZAR ALGUNA ACCIÓN
app.use((__, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch('https://ipinfo.io?token=70210017b789f6');
        const json = yield data.json();
        console.log('------------------------------------------------');
        console.log('IP Cliente: ' + json.ip);
        console.log(`Ubicación: ${json.country} ${json.region}/${json.city}`);
        console.log('Fecha:', new Date(Date.now()));
        console.log('------------------------------------------------');
        next();
    }
    catch (error) {
        console.log(error);
        next();
    }
}));
// app.use(async (__, _, next: NextFunction) => {
//     try {
//         const data = await fetch('https://github.com/tabler/tabler-icons/blob/master/icons')
//         const json = await data.json()
//         console.log(json)
//         next()
//     } catch (error) {
//         console.log(error)
//     }
// });
//DEFINIR RUTA DEL USUARIO
// Crear una instancia del enrutador de usuario
app.use('/suma/api/usuarios', UsuarioRoutes_1._UsuarioRouter);
//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', PerfilesRoutes_1._PerfilesRouter);
//DEFINIR RUTA DE LOS MODULOS
app.use('/suma/api/modulos', ModulosRoutes_1._ModulosRouter);
//DEFINIR RUTA DE LOS ROLES
app.use('/suma/api/roles', RolesRoutes_1._RolesRouter);
//DEFINIR RUTA DE LOS MENUS
app.use('/suma/api/menus', MenuRoutes_1._MenusRouter);
//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res) => {
    res.status(405).send({ error: true, message: "No se ha encontrado la request" });
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
