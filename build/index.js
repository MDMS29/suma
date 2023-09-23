"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UsuarioRoutes_1 = require("./src/routes/UsuarioRoutes");
// import { corsOptions } from './middleware/Cors'
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use(express_1.default.json());
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use('/suma/api/usuarios', UsuarioRoutes_1._UsuarioRouter);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});
