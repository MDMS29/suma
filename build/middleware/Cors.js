"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: (origin, callback) => {
        const ACCEPTED_URLS = ['http://localhost:5173'];
        if (!origin || ACCEPTED_URLS.includes(origin)) {
            callback(null, true);
        }
        if (!origin) {
            callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
};
