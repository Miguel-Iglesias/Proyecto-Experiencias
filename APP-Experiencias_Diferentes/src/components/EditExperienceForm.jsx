import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextProvider";

import { ToastContainer, toast } from "react-toastify";

import updateExperienceService from "../services/updateExperienceService";
import getExperienceService from "../services/getExperienceService"; // Suponiendo que tienes un servicio para obtener los detalles de una experiencia

const EditExperienceForm = () => {
  const { experienceId } = useParams();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    oldImage: "",
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

  const navigate = useNavigate();

  // Efecto para obtener los detalles de la experiencia cuando el componente se monta
  useEffect(() => {
    // Verificar si el usuario es administrador

    if (userLogged?.role && userLogged.role === "admin") {
      setIsAdmin(true);
      setError("");
    } else {
      setError("You do not have permission to edit an experience.");
      toast.error(error.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);

      return;
    }

    const fetchExperience = async () => {
      try {
        // Llamar al servicio para obtener los detalles de la experiencia
        const experience = await getExperienceService(experienceId, token);

        // Asegúrate de que la estructura de datos coincida con formData
        setFormData({
          title: experience.title || "",
          location: experience.location || "",
          description: experience.description || "",
          oldImage: experience.image || "",
          image: null,
          date: experience.date
            ? new Date(experience.date).toISOString().split("T")[0]
            : "",
          price: experience.price || "",
          numMinPlaces: experience.numMinPlaces || "",
          numTotalPlaces: experience.numTotalPlaces || "",
          confirmedByAdmin: experience.confirmedByAdmin || false,
        });
      } catch (error) {
        // Establecer el error en el estado
        setError(error.message);
        toast.error(error.message);
      }
    };
    fetchExperience();
  }, [experienceId, userLogged]);

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
      setError("You do not have permission to edit an experience.");
      toast.error(error.message);
      return;
    }

    // Validar la fecha
    const experienceDate = new Date(formData.date);
    const currentDate = new Date();
    if (experienceDate <= currentDate) {
      toast.error("The date must be in the future.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await updateExperienceService(
        token,
        experienceId,
        formDataToSend
      );

      // Establecer la respuesta en el estado
      //setResp(response);
      setError(null);

      if (response.status == "ok") {
        toast.success(response.message);
        setTimeout(() => {
          navigate(`/experiencias/${experienceId}`);
        }, 2000); // 2000 milisegundos = 2 segundos
      } else {
        // Muestra un mensaje de error si el login falla
        toast.error("Failed redirection");
      }
    } catch (error) {
      // Establecer el error en el estado
      // setError(error.message);
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
      <h3 className="h3">Edit Experience</h3>
      <div className="flex sm:justify-center ">
        <div className="div-content">
          <form className="mx-8 sm:m-0" onSubmit={handleSubmit}>
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
              <label>Current Image:</label>
              {formData.oldImage && (
                <img
                  className="rounded-3xl my-2"
                  src={`${formData.oldImage}`}
                  alt="Current image"
                  width="500"
                />
              )}
            </div>
            <div className="mb-2">
              <label>New Image URL:</label>
              <input type="file" name="image" onChange={handleChangeImage} />
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
              <label>Price (€):</label>
              <input
                className="input"
                type="number"
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
            <div className="text-center">
              <input
                className="blue-Button"
                type="submit"
                value="Edit Experience"
              />
            </div>
            <div>
              {error ? <p>{error}</p> : ""}
              {resp.status === "ok" ? <p>{resp.message}</p> : ""}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditExperienceForm;
