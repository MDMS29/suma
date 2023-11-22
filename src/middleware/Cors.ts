import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const whiteList = [process.env.FRONT_END_URL]

export const corsOptions: cors.CorsOptions = {
    origin: function (origin, callBack) {
        //Si el origin esta en la whiteList hacer:
        if (whiteList.includes(origin)) {
            //Consultar API
            callBack(null, true)
        } else {
            //No es permitido el request
            callBack(new Error("Error de Cors"))
        }
    }
};