import selectUserByIdModel from "../../models/users/selectUserByIdModel.js";
import updateUserProfileModel from "../../models/users/updateUserProfileModel.js";
import validateSchemaUtil from "../../utils/validateSchemaUtil.js";
import editUserProfileSchema from "../../schemas/users/editUserProfileSchema.js";
import bcrypt from "bcrypt";
import { savePhotoUtils, deletePhotoUtils } from "../../utils/photoUtils.js";

const editUserProfileController = async (req, res, next) => {
  try {
    // if (!req.user?.id) {
    //   return res.status(401).json({
    //     status: "error",
    //     message: "Unauthenticated user",
    //   });
    // }

    // Validamos el body con Joi.
    await validateSchemaUtil(editUserProfileSchema, req.body);

    // Obtenemos los datos del usuario para verificar si existe.
    const user = await selectUserByIdModel(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Verificamos la contraseña actual si se proporciona.
    if (req.body.password) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }
    }

    // Actualizamos los datos del usuario.
    const updatedData = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    };

    // Si se proporciona una nueva contraseña, la ciframos.
    if (req.body.newPassword) {
      updatedData.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    // Manejo del avatar.
    if (req.files?.avatar) {
      // Borra el avatar anterior si existe
      if (user.avatar) {
        await deletePhotoUtils(user.avatar);
      }

      // Guarda el nuevo avatar
      const avatarName = await savePhotoUtils(req.files.avatar, 500);
      updatedData.avatar = avatarName;
    }

    // Actualizamos los datos del usuario en la base de datos.
    const updatedUser = await updateUserProfileModel(req.user.id, updatedData);

    res.status(200).json({
      status: "ok",
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.error("Error in editUserProfileController:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

export default editUserProfileController;
