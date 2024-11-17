import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextProvider";
import getAdminExperiencesService from "../services/getAdminExperiencesService";
import { ToastContainer, toast } from "react-toastify";
import ExperienceFilter from "./ExperienceFilter";

const AdminExperiencesList = () => {
  const { token, userLogged } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [direction, setDirection] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userLogged?.role && userLogged.role === "admin") {
      setError("");
    } else {
      setError(error.message || "You must be an administrator");
      toast.error(error.message || "You must be an administrator");

      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }

    const fetchExperiences = async () => {
      try {
        const experiencesData = await getAdminExperiencesService(token);
        setExperiences(experiencesData);

        setFilteredExperiences(experiencesData); // Inicialmente, todos los datos están sin filtrar
      } catch (error) {
        toast.error("Error fetching experiences");
      }
    };

    fetchExperiences();
  }, [token]);

  useEffect(() => {
    let filteredData = [...experiences];

    // Filtro de búsqueda
    if (search) {
      filteredData = filteredData.filter((experience) =>
        experience.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ordenación
    if (order) {
      filteredData.sort((a, b) => {
        let aValue = a[order];
        let bValue = b[order];

        if (order === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (direction === "ASC") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredExperiences(filteredData);
  }, [search, order, direction, experiences]);

  return (
    <>
      <ExperienceFilter
        setSearch={setSearch}
        setOrder={setOrder}
        setDirection={setDirection}
      />

      <h1 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mt-5">
        E<span className="text-yellow-500">x</span>periencias
      </h1>
      <h2 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mb-3">
        {" "}
        <span className="text-cyan-500">D</span>iferentes
      </h2>
      <h3 className="h3">Reserved Experiences</h3>

      <div className="md:grid md:grid-cols-2 xl:grid-cols-3 bg-white bg-opacity-50 mb-10 mx-2 p-2 rounded-3xl">
        {filteredExperiences.map((experience, index) => (
          <div
            key={index}
            className="flex grid-row md:grid-cols-4 bg-cyan-500 bg-opacity-50 m-2 p-5 rounded-3xl"
          >
            <div className="w-1/2">
              {" "}
              <img
                className="rounded-3xl h-full object-cover"
                src={
                  experience.image
                    ? `${experience.image}`
                    : "The experience does not contain images"
                }
                alt={experience.title}
              />
            </div>

            <div className="ml-5 w-1/2 text-center">
              <h2 className="font-bold mb-2">{experience.title}</h2>
              <p className="font-bold mb-1">Location:</p> {experience.location}
              <p className="font-bold mb-1">Date: </p>
              {new Date(experience.date).toLocaleDateString()}
              <p className="font-bold mb-1">Price: €</p>
              {experience.price}
              <p className="font-bold">Reserves:</p>
              {experience.quantityPerPerson}
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </>
  );
};

export default AdminExperiencesList;
