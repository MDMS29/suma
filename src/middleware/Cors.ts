import cors from 'cors'
export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // const ACCEPTED_URLS = ['http://127.0.0.1:5173'];
        if (origin) {
            // console.log('origen ---', origin)
            callback(null, true);
            // if (ACCEPTED_URLS.includes(origin)) {
            //     callback(null, true);
            // }
        }

        callback(new Error('Not allowed by CORS'));

    },
};