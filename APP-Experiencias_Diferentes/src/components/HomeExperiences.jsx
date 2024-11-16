import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExperienceFilter from "./ExperienceFilter";
import getExperiences from "../services/experienceService";
import { ReadonlyRating } from "./RatingStar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeExperiences = () => {
  const [experiences, setExperiences] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [direction, setDirection] = useState("");
  const [error, setError] = useState("");

  const fetchExperiences = async () => {
    try {
      const entries = await getExperiences(search, order, direction);
      setExperiences(entries);
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching experiences: " + error.message);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [search, order, direction]);

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
        {error && <p>{error}</p>}

        {experiences &&
          experiences.map((experience) => (
            <div
              key={experience.id}
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
              <div className="ml-5 w-1/2">
                <h4 className="h4">{experience.title}</h4>
                <p className="p">{experience.location}</p>
                <p className="p">Date: {formatDate(experience.date)}</p>
                <p className="p">Price: {experience.price} €</p>

                <ReadonlyRating
                  value={Number(experience.rating)}
                  className="flex justify-center"
                />
                <Link
                  className="white-Button"
                  to={`/experiencias/${experience.id}`}
                >
                  Watch
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default HomeExperiences;
