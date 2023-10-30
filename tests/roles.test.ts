import request from 'supertest';
import app from '../index';


describe('Pruebas de la API', () => {
    let server: import("http").Server;// Declara una variable para mantener una referencia al servidor

    beforeAll((done) => {
        server = app.listen(0, done()); // Inicia el servidor antes de las pruebas
    });

    it('Debería de traer todos los roles que tengan el estado Activo', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODEsImlhdCI6MTY5ODMzNTM3NSwiZXhwIjoxNjk4NTA4MTc1fQ.5SAAwhZKpSVKthWIJiWZ_eH2FgjViWa-sUmP2x2YPfg';

        const response = await request(server).get('/suma/api/roles?estado=1').set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
    });
    afterAll((done) => {
        server.close(done); // Cierra el servidor después de las pruebas
    });
});
