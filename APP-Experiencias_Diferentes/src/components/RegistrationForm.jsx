import { useState } from "react";

// Importa el servicio de registro de usuario
import registerUserService from "../services/registerUserService";

// Importa los componentes ToastContainer y toast de react-toastify para mostrar notificaciones
import { ToastContainer, toast } from "react-toastify";

// Define el componente funcional RegistrationForm
const RegistrationForm = () => {
  // Declara los estados para cada campo del formulario
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Expresión regular para validar el formato del correo electrónico
  const exRegEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Maneja el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si todos los campos están llenos
    if (
      [
        username,
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
      ].includes("")
    ) {
      toast.error("All fields are required"); // Muestra un mensaje de error si algún campo está vacío
      return;
    }

    // Verifica si el formato del correo electrónico es válido
    if (!exRegEmail.test(email)) {
      toast.error("Invalid email format"); // Muestra un mensaje de error si el formato del correo no es válido
      return;
    }

    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); // Muestra un mensaje de error si las contraseñas no coinciden
      return;
    }

    try {
      // Intenta registrar al usuario llamando al servicio de registro
      const response = await registerUserService({
        username,
        firstname,
        lastname,
        email,
        password,
      });

      // Muestra un mensaje de éxito si el registro es exitoso
      if (response.status === "ok") {
        toast.success(response.message);
      } else {
        // Muestra un mensaje de error si el registro falla
        toast.error("Registration failed");
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre una excepción
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Define el formulario y maneja el evento de submit */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            name="firstname"
            placeholder="Enter first name"
            value={firstname}
            required
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            name="lastname"
            placeholder="Enter last name"
            value={lastname}
            required
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" value="Send" />
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default RegistrationForm;
