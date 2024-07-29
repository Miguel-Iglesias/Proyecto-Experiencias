const getDataUserLoggedService = async (token) => {
  const url = `${import.meta.env.VITE_API_URL}/users/profile`;

  const response = await fetch(url, {
    method: "GET", // Asegúrate de especificar el método HTTP
    headers: {
      "Content-Type": "application/json", // Especifica el tipo de contenido
      Authorization: `Bearer ${token}`, // Incluye el tipo de autorización
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error en la solicitud"); // Proporciona un mensaje de error si la solicitud falla
  }

  return json.data.user; // Asegúrate de que la estructura de datos sea la correcta
};

export default getDataUserLoggedService;
