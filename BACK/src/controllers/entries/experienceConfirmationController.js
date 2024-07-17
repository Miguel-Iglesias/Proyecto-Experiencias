import updateConfirmationService from "../../services/updateConfirmationService.js";
import validateSchemaUtil from "../../utils/validateSchemaUtil.js";
import experienceConfirmationSchema from "../../schemas/entries/experienceConfirmationSchema.js";

const experienceConfirmationController = async (req, res, next) => {
  try {
    const experienceId = req.params.id;
    const { active } = req.body;

    //Validar el body con Joi.
    await validateSchemaUtil(experienceConfirmationSchema, req.body);

    await updateConfirmationService(experienceId, active);

    res.send({
      status: "ok",
      message: "Estado de confirmación modificado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export default experienceConfirmationController;
