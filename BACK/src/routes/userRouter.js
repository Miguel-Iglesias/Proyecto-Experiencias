import express from 'express';
import registerUser from '../controllers/users/registerUser.js';
import loginUserController from '../controllers/users/loginUserController.js';
import sendRecoverPassController from '../controllers/users/sendRecoverPassController.js';

const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Soy rutas de usuarios");
});

router.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de Experiencias Diferentes!");
});
//Crear un usuario pendiente de activar.
router.post("/register", registerUser);
//Validar a un usuario.
router.get("/users/validate/:registrationCode", validateUserController);
// Ruta para el login de usuario

router.post('/login', loginUserController);  // Añadido el endpoint de login

// Define la ruta del endpoint de recuperación de contraseña
router.post('/recover-password', sendRecoverPassController);

export default router;
