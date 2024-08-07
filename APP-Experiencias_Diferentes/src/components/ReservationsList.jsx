import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContextProvider";
import getReservationListService from "../services/getReservationsListService";
import { ReadonlyRating } from "./RatingStar";
import ExperienceFilter from "./ExperienceFilter";
import CancellationExperienceComponent from "./CancellationExperienceComponent";

const ReservationsList = () => {
  const { VITE_API_URL } = import.meta.env;

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [direction, setDirection] = useState("");
  const [error, setError] = useState("");
  const [ReservedExperience, setReservedExperience] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        // Llamar al servicio para obtener los detalles de la experiencia
        const ReservedExperience = await getReservationListService(token);
        setReservedExperience(ReservedExperience);
      } catch (error) {
        // Establecer el error en el estado
        setError(error.message);
        toast.error(error.message);
      }
    };
    fetchExperience();
  }, [token]);

  const updateExperienceState = (experienceId, newState) => {
    setReservedExperience((prevState) =>
      prevState.map((experience) =>
        experience.experienceId === experienceId
          ? { ...experience, state: newState }
          : experience
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <ToastContainer />
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

      <div className="md:grid md:grid-cols-2 xl:grid-cols-3 bg-white bg-opacity-50 mb-10 mx-2 p-2 rounded-3xl">
        {ReservedExperience &&
          ReservedExperience.map((ReservedExp) => (
            <div
              key={ReservedExp.id}
              className="flex grid-row md:grid-cols-4 bg-cyan-500 bg-opacity-50 m-2 p-5 rounded-3xl"
            >
              <div className="w-1/2">
                <img
                  className="rounded-3xl h-full object-cover"
                  src={
                    ReservedExp.image
                      ? `${VITE_API_URL}/uploads/${ReservedExp.image}`
                      : "The experience does not contain images"
                  }
                  alt={ReservedExp.title}
                />
              </div>
              <div className="ml-5 w-1/2 text-center">
                <h4 className="h4">{ReservedExp.title}</h4>
                <p className="p">{ReservedExp.location}</p>
                <p className="p">Date: {formatDate(ReservedExp.date)}</p>
                <p className="p">Price: {ReservedExp.price} €</p>
                <p className="p mb-3">
                  Reserves: {ReservedExp.quantityPerPerson}{" "}
                </p>
                <ReadonlyRating
                  value={Number(ReservedExperience.rating)} // Por defecto, muestra 4 estrellas pintadas
                  className="flex justify-center"
                ></ReadonlyRating>
                <CancellationExperienceComponent
                  experienceId={ReservedExp.id}
                  state={ReservedExp.state}
                  reservationDate={ReservedExp.date}
                  changeState={updateExperienceState}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ReservationsList;
