import { useRef, useState } from "react";
import Error from "../components/Error";
import useAuth from "../hooks/useAuth";
import conexionCliente from "../config/ConexionCliente";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import img_login from "../assets/images/img_login.png"
import { InputText } from "primereact/inputtext";

const Login = () => {
  const { setAuthUsuario, setAuthModulos } = useAuth();
  const captcha = useRef(null);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState({ error: false, message: "" });
  const [eye, setEye] = useState(false);

  const navigate = useNavigate();

  const handle_submit = async (e) => {
    e.preventDefault();
    if ([usuario, clave].includes("")) {
      setError({ error: true, message: "Hay campos vacios" });
      setTimeout(() => {
        setError({ error: false, message: "" });
      }, 1500);
      return;
    } else {
      const data = await fetch("https://ipinfo.io?token=70210017b789f6");
      const res = await data.json();
      const body = {
        usuario: usuario,
        clave: clave,
        captcha: captcha.current.getValue(),
        ip: `${res?.ip}`,
        ubicacion: `${res?.country} - ${res?.city}/${res?.region}`,
      };
      try {
        const { data } = await conexionCliente.post(
          "usuarios/autenticar_usuario",
          body,
          { mode: "cors" }
        );
        if (data?.error) {
          setError({ error: true, message: data.message });
          setTimeout(() => {
            setError({ error: false, message: "" });
          }, 1500);
          return;
        }
        localStorage.setItem("token", data.usuario.token);
        localStorage.setItem("modulos", JSON.stringify(data.modulos));
        setAuthUsuario(data.usuario);
        setAuthModulos(data.modulos);
        navigate("/home");
      } catch (error) {
        setError({ error: true, message: error.response.data.message });
        setTimeout(() => {
          setError({ error: false, message: "" });
        }, 1500);
        return;
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center container mx-auto ">
      <div className="flex bg-white rounded-lg shadow-xl max-w-5xl flex-wrap">
        <div className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2 p-4 flex justify-center items-center flex-col">
          <h3 className="text-slate-900  mt-1 text-3xl font-semibold text-center ">
            Ingrese a <span className="text-primaryYellow">SUMA</span>
          </h3>
          <h4 className="text-slate-500  my-4 text-sm text-center">
            Sistema Unificado de Mejora y Autogestion
          </h4>
          <form
            onSubmit={(e) => handle_submit(e)}
            id="mySelect"
            className="flex space-y-7 flex-col w-3/4"
          >
            {error.error ? <Error>{error.message}</Error> : ""}

            <div>
              <input
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-200"
                type="text"
                id="usuario"
                placeholder="Usuario"
                onChange={(e) => setUsuario(e.target.value)}
                value={usuario}
              />
            </div>

            <div className="p-inputgroup flex-1">
              <InputText
                type={eye ? "text" : "password"}
                id="contrasena"
                placeholder="Contraseña"
                onChange={(e) => setClave(e.target.value)}
                value={clave}
                minLength={8}
                maxLength={25}
                className=" focus:outline-none focus:ring-2 focus:ring-yellow-200 border rounded-l-lg px-3 py-2"
              />
              <span className="p-inputgroup-addon rounded-r-lg">
                <i
                  onClick={(e) => setEye(!eye, e)}
                  className={eye ? "pi pi-eye" : "pi pi-eye-slash"}
                ></i>
              </span>
            </div>

            <div className="recaptcha self-center">
              <ReCAPTCHA
                ref={captcha}
                sitekey={import.meta.env.VITE_CAPTCHA_KEY_WS}
              />
            </div>

            <input
              type="submit"
              value="Ingresar"
              className="w-full px-4 py-2 border-2 border-primaryYellow rounded-lg bg-secundaryYellow hover:bg-primaryYellow font-bold"
            />
          </form>
        </div>
        <div className=" rounded-r-lg w-full  md:w-1/2 lg:w-1/2 xl:w-1/2 hidden md:block">
          <img
            src={img_login}
            alt="Mascota Devitech"
            className="h-full rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
