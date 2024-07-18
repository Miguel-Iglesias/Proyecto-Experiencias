import Joi from "joi";
import insertExperienceModel from "../../models/entries/insertExperienceModel.js";
import verifyAdmin from "../../middleware/verifyAdminController.js";

// Creamos el esquema.
const experienciaSchema = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string().required(),
  location: Joi.string().max(30).required(),
  image: Joi.required(),
  date: Joi.date().required(),
  price: Joi.string().required(),
  numMinPlaces: Joi.number().integer().positive().required(),
  numTotalPlaces: Joi.number().integer().positive().required(),
});

// Función controladora final que agrega una nueva entrada.
const adminEntryController = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      image,
      date,
      price,
      numMinPlaces,
      numTotalPlaces,
    } = req.body;

    const userId = req.user?.id;

    // Verificar que el usuario sea admin
    const isAdmin = await verifyAdmin(userId);
    if (!isAdmin) {
      return res.status(403).send({
        status: "error",
        message: "You do not have permissions to perform this action",
      });
    }

    // Validamos el body con Joi.
    await experienciaSchema.validateAsync(req.body);

    // Insertamos la entrada y obtenemos el id que se le ha asignado.
    const experienceId = await insertExperienceModel(
      title,
      location,
      description,
      image,
      date,
      price,
      numMinPlaces,
      numTotalPlaces,
      userId
    );

    res.send({
      status: "ok",
      message: "Successfully created experience.",
      data: {
        experience: {
          id: experienceId,
          title,
          location,
          description,
          image,
          date,
          price,
          numMinPlaces,
          numTotalPlaces,
          userId,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export default adminEntryController;
