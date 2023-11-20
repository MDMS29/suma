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
const server_1 = __importDefault(require("../config/server"));
describe('Pruebas de la API', () => {
    let server; // Declara una variable para mantener una referencia al servidor
    beforeAll((done) => {
        server = server_1.default.listen(0, done()); // Inicia el servidor antes de las pruebas
    });
    it('Debería de traer todos los roles que tengan el estado Activo', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODEsImlhdCI6MTY5ODMzNTM3NSwiZXhwIjoxNjk4NTA4MTc1fQ.5SAAwhZKpSVKthWIJiWZ_eH2FgjViWa-sUmP2x2YPfg';
        const response = yield (0, supertest_1.default)(server).get('/suma/api/roles?estado=1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    }));
    afterAll((done) => {
        server.close(done); // Cierra el servidor después de las pruebas
    });
});
