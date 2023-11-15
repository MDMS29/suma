import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"

const Home = () => {

  const { authUsuario } = useAuth()

  const [dataIP, setDataIP] = useState({})
  useEffect(() => {
    (async () => {
      const data = await fetch('https://ipinfo.io?token=70210017b789f6')
      const res = await data.json()
      setDataIP(res)
    })()
  }, [])



  return (
    <div className="h-screen w-full p-4">
      <section className="mt-5 p-3 bg-white rounded shadow border w-full">
        <h1>Bienvenido al sistema SUMA, {authUsuario.nombre_completo}</h1>
        <div className="flex flex-col mt-3">
          <small className="text-gray-400">IP: {dataIP?.ip}</small>
          <small className="text-gray-400">Ubicación: {`${dataIP?.country} - ${dataIP?.city}/${dataIP?.region}`}</small>
        </div>
      </section>
    </div>
  )
}

export default Home