import express from 'express'
import cors from 'cors'
import { _UsuarioRouter } from './src/routes/UsuarioRoutes'
// import { corsOptions } from './middleware/Cors'
import dotenv from 'dotenv'

const app = express()
app.disable('x-powered-by')
app.use(express.json())

dotenv.config()
app.use(cors());

app.use('/suma/api/usuarios', _UsuarioRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`)
})