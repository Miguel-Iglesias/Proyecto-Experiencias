import Joi from "joi";

const editExperienceSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().uri().optional(),
  date: Joi.date().iso().required(),
  numMinPlaces: Joi.number().integer().required(),
  numTotalPlaces: Joi.number().integer().required(),
  confirmedByAdmin: Joi.boolean().required(),
});

export default editExperienceSchema;
