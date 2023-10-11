import { useEffect, useState, createContext } from "react";
import conexionCliente from "../config/ConexionCliente";
import { useLocation } from "react-router-dom";

const UsuariosContext = createContext();

const UsuariosProvider = ({ children }) => {
  const [dataUsuarios, setDataUsuarios] = useState([])
  const [eliminarUsuario, setEliminarUsuario] = useState({})
  

  const location = useLocation()

  useEffect(() => {
    const getUsuarios = async () => {
      const token = localStorage.getItem('token')
      
      const config = {
        headers: {
          "Content-Type": "apllication/json",
          Authorization: `Bearer ${token}`
        }
      }
      
      const estado = location.pathname.includes('inactivos') ? 2 : 1


      try {
        const { data } = await conexionCliente(`/usuarios?estado=${estado}`, config)
        setDataUsuarios(data)
      } catch (error) {
        setDataUsuarios([])
      }
    }
    getUsuarios()
  }, [location.pathname])

  const eliminarUsuarioProvider = async () => {
    if (eliminarUsuario.id_usuario) {
      const token = localStorage.getItem('token')
      let estadoUsuario = 0
      if (eliminarUsuario.estado_usuario == "ACTIVO") {
        estadoUsuario = 2
      } else {
        estadoUsuario = 1
      }
      const config = {
        headers: {
          "Content-Type": "apllication/json",
          Authorization: `Bearer ${token}`
        }
      }
      try {
        const { data } = await conexionCliente.delete(`/usuarios/${eliminarUsuario.id_usuario}?estado=${estadoUsuario}`, config)
        console.log(data)
        if (data.error) {
          console.log(data.message)
        }

        const usuarioActualizados = dataUsuarios.filter(usuario => usuario.id_usuario !== eliminarUsuario.id_usuario)
        setDataUsuarios(usuarioActualizados)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const [UsuariosAgg, setUsuariosAgg] = useState({
    nombre: "",
    usuario: "",
    correo: "",
    clave: "",
    claverepetida: "",
  });

  const [errors, setErrors] = useState({
    nombre: '',
    usuario: '',
    correo: '',
    clave: '',
    claverepetida: '',
  });

  const [perfilesAgg, setPerfilesAgg] = useState([]);
  const [modulosAgg, setModulosAgg] = useState([]);
  const [permisosAgg, setPermisosAgg] = useState([]);

  const [validacionesExitosas, setValidacionesExitosas] = useState(true);


  // const handleChangeUsuario = (e) => {
  //   setUsuariosAgg({ ...UsuariosAgg, [e.target.name]: e.target.value });
  // };

  useEffect(() => {
    const getUsuarios = async () => {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "apllication/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await conexionCliente(`/usuarios?estado=1`, config);
        console.log(data);
        setDataUsuarios(data);
        // navigate('/home')
      } catch (error) {
        setDataUsuarios([]);
        // navigate('/')
      }
    };
    getUsuarios();
  }, []);

  const obtenerPerfiles = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/perfiles?estado=1`, config);
      console.log(data);
      setPerfilesAgg(data);
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };
  const obtenerModulos = async (perfiles) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.post(
        `/perfiles/modulos`,
        perfiles,
        config
      );
      console.log(data);
      setModulosAgg(data);
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };

  const guardarUsuario = async (formData) => {
    const token = localStorage.getItem("token");
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      // Realiza la solicitud POST a la API para guardar la información del usuario
      const response = await conexionCliente.post("/usuarios", formData, config);
      console.log("Información guardada con éxito:", response);
      return response.data; // Puedes devolver los datos guardados si es necesario
    } catch (error) {
      console.error("Error al guardar la información:", error);
      throw error; // Puedes lanzar una excepción en caso de error
    }
  };

   // -----------------validaciones-----------------------------

   const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setUsuariosAgg({ ...UsuariosAgg, [name]: value });
    // setUsuariosAgg({ ...UsuariosAgg, [name]: value });
    // setUsuariosAgg({ ...UsuariosAgg, [e.target.name]: e.target.value });

    // Realiza validaciones específicas para cada campo
    if (name === 'nombre') {
      if (value.length < 10 || value.length > 30) {
        setErrors({ ...errors, [name]: 'Debe tener entre 10 y 30 caracteres' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }

    if (name === 'usuario') {
      if (value.length < 5 || value.length > 15) {
        setErrors({ ...errors, [name]: 'El usuario debe tener entre 5 y 15 caracteres' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }

    if (name === 'correo') {
      // Realiza validación de correo electrónico (puedes utilizar una expresión regular)
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (!emailPattern.test(value)) {
        setErrors({ ...errors, [name]: 'El correo electrónico no es válido' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }

    // if (name === 'clave' || name === 'claverepetida') {
    //   if (UsuariosAgg.clave !== UsuariosAgg.claverepetida) {
    //     setErrors({ ...errors, clave: 'Las contraseñas no coinciden' });
    //   } else {
    //     setErrors({ ...errors, clave: '', claverepetida: '' });
    //   }
    // }

    
    
  };


  return (
    <UsuariosContext.Provider
      value={{
        dataUsuarios,
        handleChangeUsuario,
        UsuariosAgg,
        setUsuariosAgg,
        obtenerPerfiles,
        perfilesAgg,
        obtenerModulos,
        modulosAgg,
        setModulosAgg, 
        permisosAgg,
        guardarUsuario,
        errors,
        setErrors,
        setEliminarUsuario, 
        eliminarUsuario, 
        eliminarUsuarioProvider 
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export { UsuariosProvider };

export default UsuariosContext;
