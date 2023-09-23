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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectAndQuery = void 0;
const db_1 = require("../config/db");
const DaoUsuarios_1 = require("../dao/DaoUsuarios");
const connectAndQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const result = yield db_1.client.query(DaoUsuarios_1._SeleccionarTodosLosUsuarios);
        console.log('Filas de la tabla:', result);
    }
    catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error);
    }
    finally {
        console.log('Consulta finalizada');
        // await client.end();
    }
});
exports.connectAndQuery = connectAndQuery;
