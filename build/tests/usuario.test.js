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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index")); // Importa el servidor Express
describe('Pruebas de la API', () => {
    let server; // Declara una variable para mantener una referencia al servidor
    beforeAll((done) => {
        server = index_1.default.listen(0, done); // Inicia el servidor antes de las pruebas
    });
    it('debería crear un usuario y devolver un token aleatorio', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            usuario: 'LuisB',
            clave: '123123',
            captcha: 'ajskywoincjkasfg21783sjkbc8',
        };
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/suma/api/usuarios/autenticar_usuario')
            .send(userData);
        expect(response.status).toBe(200); // Verifica el código de estado
        // Verifica que el token esté presente en la respuesta
        expect(response.body.usuario.token).toBeDefined();
        expect(response.body.modulos).toBeDefined();
        // Verifica la estructura del usuario
        expect(response.body).toMatchObject({
            "usuario": {
                "id_usuario": 81,
                "nombre_completo": "Luis Barraza",
                "usuario": "LuisB",
                "fecha_creacion": "2023-10-17T13:59:42.336Z",
                "correo": "luis.barraza@devitech.com.co",
                "id_estado": "1",
                "cm_clave": false,
                "perfiles": [
                    {
                        "id_perfil": 15,
                        "nombre_perfil": "PROVEEDOR",
                        "estado_perfil": "1"
                    },
                    {
                        "id_perfil": 2,
                        "nombre_perfil": "CONSULTOR",
                        "estado_perfil": "1"
                    },
                    {
                        "id_perfil": 1,
                        "nombre_perfil": "ADMINISTRADOR",
                        "estado_perfil": "1"
                    }
                ]
            }
        });
    }));
    afterAll((done) => {
        server.close(done); // Cierra el servidor después de las pruebas
    });
});
