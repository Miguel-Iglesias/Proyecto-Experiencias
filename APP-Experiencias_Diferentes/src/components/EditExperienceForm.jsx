import { useState, useEffect } from "react";
import updateExperienceService from "../services/updateExperienceService";
import getExperienceService from "../services/getExperienceService"; // Suponiendo que tienes un servicio para obtener los detalles de una experiencia

const EditExperienceForm = ({ experienceId }) => {
    // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    image: '',
    date: '',
    price: '',
    numMinPlaces: '',
    numTotalPlaces: ''
  });
   // Estado para los errores
  const [error, setError] = useState('');
  // Estado para la respuesta de la API
  const [resp, setResp] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  // Efecto para obtener los detalles de la experiencia cuando el componente se monta
  useEffect(() => {

    // Verificar si el usuario es administrador
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setError('You do not have permission to edit an experience.');
      return;
    }

    const fetchExperience = async () => {
      try {
        // Llamar al servicio para obtener los detalles de la experiencia
        const experience = await getExperienceService(experienceId);
        // Establecer los datos de la experiencia en el estado del formulario
        setFormData(experience.data);
      } catch (error) {
        // Establecer el error en el estado
        setError(error.message);
      }
    };
    fetchExperience();
  }, [experienceId]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('You do not have permission to edit an experience.');
      return;
    }
    try {
        // Llamar al servicio para actualizar la experiencia
      const response = await updateExperienceService({ experienceId, ...formData });
      setResp(response);
      // Establecer la respuesta en el estado
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isAdmin) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
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
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date:</label>
        <input
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
          type="number"
          name="numTotalPlaces"
          value={formData.numTotalPlaces}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input type="submit" value="Update Experience" />
      </div>
      <div>
        {error ? <p>{error}</p> : ''}
      </div>
      <div>
        {resp.status === 'ok' ? <><p>{resp.message}</p></> : ''}
      </div>
    </form>
  );
};

export default EditExperienceForm;