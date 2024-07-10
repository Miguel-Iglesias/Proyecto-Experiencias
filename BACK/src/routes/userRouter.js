import express from "express";

import {
  registerUser,
  loginUserController,
  sendRecoverPassController,
  editUserPassController,
  validateUserController,
  editUserProfileController,
} from "../controllers/users/index.js";

import authUserController from "../middleware/authUserController.js";

const router = express.Router();

//Crear un usuario pendiente de activar.
router.post("/users/register", registerUser);

//Validar a un usuario.
router.put("/users/validate/:registrationCode", validateUserController);

// Ruta para el login de usuario
router.post("/users/login", loginUserController); // Añadido el endpoint de login

// Define la ruta del endpoint de recuperación de contraseña
router.post("/users/recover-password", sendRecoverPassController);

// Editar la contraseña de un usuario con un código de recuperación.
router.put("/users/password", editUserPassController);

//Define la ruta para actualizar el perfirl de usuario.
router.put("/users/profile", authUserController, editUserProfileController);

export default router;
