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
const UsuarioRoutes_1 = require("./src/routes/UsuarioRoutes");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const PerfilesRoutes_1 = require("./src/routes/PerfilesRoutes");
const app = (0, express_1.default)();
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, "./.env") });
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//OBTENER LA IP DEL CLIENTE AL REALIZAR ALGUNA ACCIÓN
app.use((__, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('https://ipinfo.io/json');
    const json = yield data.json();
    console.log('------------------------------------------------');
    console.log('IP Cliente: ' + json.ip);
    console.log(`Ubicación: ${json.country} ${json.region}/${json.city}`);
    console.log('Fecha:', new Date(Date.now()));
    console.log('------------------------------------------------');
    next();
}));
//DEFINIR RUTA DEL USUARIO
// Crear una instancia del enrutador de usuario
app.use('/suma/api/usuarios', UsuarioRoutes_1._Usuario_Router);
//DEFINIR RUTA DE LOS PERFILES
app.use('/suma/api/perfiles', PerfilesRoutes_1._PerfilesRouter);
//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
app.use((_, res) => {
    res.send({ error: true, message: "Pagína no encontrada" });
});
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
