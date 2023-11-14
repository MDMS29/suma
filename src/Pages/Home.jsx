import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import conexion_cliente from "../config/ConexionCliente"

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
  const [src, setSrc] = useState(null)

  // setTimeout(()=> pdf(), 10000)
  const pdf = async () => {
    // setVerPDF(!verPDF)
    try {

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await conexion_cliente('compras/requisiciones/doc/1', config)
      console.log(data.split('filename=')[1].split(';')[0])
      setSrc(data)
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="h-screen w-full p-4">
      <section className="mt-5 p-3 bg-white rounded shadow border w-full">
        <h1>Bienvenido al sistema SUMA, {authUsuario.nombre_completo}</h1>
        <div className="flex flex-col mt-3">
          <small className="text-gray-400">IP: {dataIP?.ip}</small>
          <small className="text-gray-400">Ubicación: {`${dataIP?.country} - ${dataIP?.city}/${dataIP?.region}`}</small>
        </div>
      </section>
    <button className="text-white bg-red-800 p-3" onClick={pdf}>VER PDF</button>
       <iframe className="w-full h-full" src={src}></iframe>

    </div>
  )
}

export default Home