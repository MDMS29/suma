import cors from 'cors'
export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        const ACCEPTED_URLS = ['http://localhost:5173'];

        if (!origin || ACCEPTED_URLS.includes(origin)) {
            callback(null, true);
        }
        if(!origin) {
            callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));

    },
};