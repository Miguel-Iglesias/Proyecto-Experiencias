import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContextProvider";

import { ToastContainer, toast } from "react-toastify";

import createExperienceService from "../services/createExperienceService";

// Estado para los datos del formulario
const CreateExperienceForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    image: "",
    date: "",
    price: "",
    numMinPlaces: "",
    numTotalPlaces: "",
    confirmedByAdmin: false,
  });
  // Estado para los errores
  const [error, setError] = useState("");
  // Estado para la respuesta de la API
  const [resp, setResp] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const { userLogged, token } = useContext(AuthContext);

  useEffect(() => {
    //Verificar si el usuario es administrador

    if (userLogged?.role && userLogged.role === "admin") {
      setIsAdmin(true);
    } else {
      setError(error.message);
      toast.error(error.message);
    }
  }, []);

  // Manejar cambios en el campo imagen
  const handleChangeImage = (e) => {
    setFormData({
      ...formData,
      ["image"]: e.target.files[0],
    });
  };

  // Manejar cambios en el campos del formulario booleano
  const handleChangeBoolean = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("You do not have permission to create an experience.");
      toast.error(error.message);
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      // Llamar al servicio para crear una experiencia
      const response = await createExperienceService(token, formDataToSend);

      // Establecer la respuesta en el estado
      //setResp(response);
      setError(null);
      toast.success(response.message);
    } catch (error) {
      // Establecer el error en el estado
      setError(error.message);
      toast.error(error.message);
    }
  };
  if (!isAdmin) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mt-5">
        E<span className="text-yellow-500">x</span>periencias
      </h1>
      <h2 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mb-3">
        {" "}
        <span className="text-cyan-500">D</span>iferentes
      </h2>
      <h3 className="h3">Create New Experience</h3>
      <div className="flex text-center justify-center">
        <form className="div-content-not-center" onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              className="input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              className="input"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              className="input"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChangeImage}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              className="input"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              className="input"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Minimum Number of Places:</label>
            <input
              className="input"
              type="number"
              name="numMinPlaces"
              value={formData.numMinPlaces}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Total Number of Places:</label>
            <input
              className="input"
              type="number"
              name="numTotalPlaces"
              value={formData.numTotalPlaces}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirmed by Admin:</label>
            <input
              type="checkbox"
              name="confirmedByAdmin"
              checked={formData.confirmedByAdmin}
              onChange={handleChangeBoolean}
            />
          </div>
          <div>
            <input
              className="blue-Button"
              type="submit"
              value="Create Experience"
            />
          </div>
          <div>{error ? <p>{error}</p> : ""}</div>
          <div>
            {resp.status == "ok" ? (
              <>
                <p>{resp.message}</p>
              </>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateExperienceForm;
