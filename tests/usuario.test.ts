import request from 'supertest';
import app from '../src/config/server'; // Importa el servidor Express

describe('Pruebas de la API', () => {
    let server: any; // Declara una variable para mantener una referencia al servidor

    beforeAll((done) => {
        server = app.listen(0, done); // Inicia el servidor antes de las pruebas
    });
    it('debería crear un usuario y devolver un token aleatorio', async () => {
        const userData = {
            usuario: 'LuisB',
            clave: '123123',
            captcha: 'ajskywoincjkasfg21783sjkbc8',
        };

        const response = await request(app)
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
    });
    afterAll((done) => {
        server.close(done); // Cierra el servidor después de las pruebas
    });

});
