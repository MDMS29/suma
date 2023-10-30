"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const UsuarioRoutes_1 = require("../routes/UsuarioRoutes");
describe('GET /user', function () {
    it('responds with json', function (done) {
        (0, supertest_1.default)(UsuarioRoutes_1._UsuarioRouter)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
