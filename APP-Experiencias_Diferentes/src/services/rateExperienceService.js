const rateExperienceService = async (token, data) => {
    // Construir la URL del endpoint de la API
    const url = `${import.meta.env.VITE_API_URL}/experiencias/:experienceId/votes`;
    // Realizar una solicitud POST para crear una nueva experiencia
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token, // Incluir el token en el encabezado Authorization
      },
      body: data,
    });
  
    // Convertir la respuesta en formato JSON
    const json = await response.json();
    // Si la respuesta no es exitosa, lanzar un error con el mensaje de la respuesta
    if (!response.ok) throw new Error(json.message);
  
    // Devolver la respuesta en formato JSON
    return json;
  };
  console.log(response);
  export default createExperienceService;
  