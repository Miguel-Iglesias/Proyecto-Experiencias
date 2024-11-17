import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { RatingValue, ReadonlyRating } from "./RatingStar";
import { ToastContainer, toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContextProvider";
import makeReservationService from "../services/makeReserevationService";
import getExperienceService from "../services/getExperienceService";
import DuplicateExperienceComponent from "./DuplicateExperienceComponent";

const GetExperienceById = () => {
  // Ruta al Back

  // Obtención del token
  const { userLogged, token } = useContext(AuthContext);

  // Obtención de la experiencia elegida
  const { experienceId } = useParams();

  // Estado para la respuesta de la API
  const [experience, setExperience] = useState("");

  // Estado para los datos del formulario
  const [reservation, setReservation] = useState({
    quantityPerPerson: 0,
    state: true,
  });

  // Estado para los errores
  const [error, setError] = useState("");

  // Efecto para obtener los detalles de la experiencia cuando el componente se monta
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        // Llamar al servicio para obtener los detalles de la experiencia
        const experience = await getExperienceService(experienceId, token);

        setExperience(experience);
        setError("");
      } catch (error) {
        // Establecer el error en el estado
        setError(error.message);
        toast.error(`Failed to fetch experience: ${error.message}`);
      }
    };
    fetchExperience();
  }, [experienceId, userLogged]);

  const handleClick = async () => {
    // Verifica la fecha de la reserva antes de poder reservar

    const currentDate = new Date();
    const reservationDateObj = new Date(experience.date);

    if (reservationDateObj <= currentDate) {
      setError(
        "You cannot reserve for a date that has already passed or is today."
      );
      toast.error(
        "You cannot reserve for a date that has already passed or is today."
      );
      return;
    }

    // Verifica si hay plazas disponibles antes de intentar reservar
    if (experience.availablePlaces <= 0) {
      toast.error("No available places left");
      return;
    }

    if (reservation.quantityPerPerson === 0) {
      toast.error("Number of reserves must be greater than 0");
      return;
    }

    try {
      const json = await makeReservationService(
        token,
        experienceId,
        reservation
      );

      setError(null);

      // Muestra un mensaje de éxito si el registro es exitoso
      if (json.status === "ok") {
        toast.success(json.message);

        // Actualiza los lugares disponibles y que fue reservado por el usuario
        setExperience((prevExperience) => ({
          ...prevExperience,
          availablePlaces:
            prevExperience.availablePlaces - reservation.quantityPerPerson,
          reservedByMe: true,
        }));

        // Resetea la cantidad de reserva
        setReservation({
          quantityPerPerson: 0,
          state: false,
        });
      }
    } catch (error) {
      toast.error("Reservation failed");
    }
  };

  const changeNumber = (amount) => {
    if (amount == -1 && experience.availablePlaces == 0) {
      return;
    }
    if (
      amount == 1 &&
      experience.availablePlaces == reservation.quantityPerPerson
    ) {
      return;
    }

    if (reservation.quantityPerPerson <= 0 && amount == -1) {
      return;
    }

    let newState = false;

    if (reservation.quantityPerPerson + amount > 0) {
      newState = true;
    }

    setReservation({
      ...reservation,
      quantityPerPerson: reservation.quantityPerPerson + amount,
      state: newState,
    });
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const yearExperience = parseInt(experience.date?.split("-")[0]);
  const monthExperience = parseInt(experience.date?.split("-")[1]);
  const dayExperience = parseInt(experience.date?.split("-")[2]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  return (
    <>
      <h1 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mt-5">
        E<span className="text-yellow-500">x</span>periencias
      </h1>
      <h2 className="flex font-titleLicorice text-5xl font-black justify-center text-white tracking-wider mb-3">
        {" "}
        <span className="text-cyan-500">D</span>iferentes
      </h2>
      <h3 className="h3">Your selection: {experience.title}</h3>
      <div className="flex text-center justify-center">
        <div className="div-content">
          <img
            className="rounded-3xl"
            src={
              experience.image
                ? `${experience.image}`
                : "The experience does not contain images"
            }
            alt={experience.title}
          />
          <p className="m-3">
            <span className="font-bold">Location:</span> {experience.location}
          </p>
          <p className="mb-3">
            <span className="font-bold">Description:</span>{" "}
            {experience.description}
          </p>
          <p className="mb-3">
            <span className="font-bold">Date:</span>
            {formatDate(experience.date)}
          </p>
          {reservation.userId == userLogged &&
          (yearExperience < year ||
            (yearExperience === year && monthExperience < month) ||
            (yearExperience === year &&
              monthExperience === month &&
              dayExperience < day)) ? (
            <div>
              <h3 className="font-bold">Value the experience</h3>{" "}
              <RatingValue />{" "}
            </div>
          ) : (
            <div>
              <h3 className="font-bold">Experience&apos;s ratings</h3>{" "}
              <ReadonlyRating />
            </div>
          )}
          <p className="m-3">
            <span className="font-bold">Price:</span> {experience.price} €
          </p>
          <p className="mb-3">
            <span className="font-bold">Active:</span> {experience.active}
          </p>
          <p className="mb-3">
            <span className="font-bold">Rating:</span> {experience.rating}
          </p>
          <p className="mb-3">
            <span className="font-bold">Available Places:</span>{" "}
            {experience.availablePlaces
              ? experience.availablePlaces - reservation.quantityPerPerson
              : experience.availablePlaces}
          </p>
          <p className="mb-3">
            <span className="font-bold">Confirmed:</span> {experience.confirmed}
          </p>
          {userLogged ? (
            <div className="flex flex-col items-center justify-center">
              <p className="mb-3">
                <span className="font-bold">Valorated By Me:</span>{" "}
                {experience.valoratedByMe}
              </p>
              <p className="mb-3">
                <span className="font-bold">Reserved By Me:</span>{" "}
                {experience.reservedByMe ? "Yes" : "No"}
              </p>
              <label>
                <span className="font-bold">Number of Places to reserve:</span>
              </label>
              <div>
                <button
                  onClick={() => changeNumber(-1)}
                  disabled={reservation.quantityPerPerson <= 0}
                >
                  <img
                    className="w-5 inline"
                    src="/iconMinusReservations.svg"
                    alt="-"
                  />
                </button>
                <input
                  className="bg-slate-300 mx-1 my-3 w-12 md:w-64 lg:w-80 text-center rounded-3xl"
                  type="number"
                  name="reservations"
                  value={reservation.quantityPerPerson}
                  readOnly
                  required
                />
                <button
                  onClick={() => changeNumber(1)}
                  disabled={
                    reservation.quantityPerPerson >= experience.availablePlaces
                  }
                >
                  <img
                    className="w-5 inline"
                    src="/iconPlusReservations.svg"
                    alt="+"
                  />
                </button>
              </div>
              <input
                className="blue-Button"
                type="submit"
                value="Reserve"
                onClick={handleClick}
                disabled={experience.availablePlaces <= 0}
              />
            </div>
          ) : (
            ""
          )}
          {userLogged?.role && userLogged.role === "admin" ? (
            <>
              <Link
                className="blue-Button"
                to={`/experiencias/edit/${experienceId}`}
              >
                Edit your experience
              </Link>

              <DuplicateExperienceComponent />
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default GetExperienceById;
