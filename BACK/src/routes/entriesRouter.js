import express from "express";

// Importar funciones controladoras intermedias
import {
  authUserController,
  getUserController,
  verifyAdmin
} from "../middleware/index.js";

// Importar funciones controladoras finales desde el índice de entradas
import {
  adminEntryController,
  experienceAcivtionConfirmationController,
  experiencesListController,
  getExperienceController,
  handleCancelledReservationController,
  editExperienceController,
  duplicateExperienceController,
  getReservedExperiencesById,
  voteExperienceController,
} from "../controllers/entries/index.js";

const router = express.Router();

// Endpoint para la creación de experiencia por parte de un administrador
router.post("/experiencias", authUserController, verifyAdmin, adminEntryController);

// Obtención de la lista de experiencias
router.get("/experiencias", getUserController, experiencesListController);

// Endpoints para desactivar, reactivar y confirmar la experiencia
router.put(
  "/experiencias/:experienceId/experienceState",
  authUserController,
  experienceAcivtionConfirmationController
);

// Endpoint para reservar y cancelar la reserva de una experiencia
router.put(
  "/experiencias/:experienceId/reservation",
  authUserController,
  handleCancelledReservationController
);

// Endpoint para listar las experiencias reservadas
router.get(
  "/experiencias/reservedExperiences",
  authUserController,
  getReservedExperiencesById
);

// Endpoint para visualizar una experiencia específica
router.get("/experiencias/:experienceId", getExperienceController);

//Endpoint modificar experiencia (admin)
router.put(
  "/experiencias/:experienceId/edit",
  authUserController,
  editExperienceController
);

// Endpoint para duplicar una experiencia (solo para administradores)
router.post(
  "/experiencias/:id/duplicate",
  authUserController,
  duplicateExperienceController
);

// Votar una experiencia.
router.post(
  "/experiencias/:experienceId/votes",
  authUserController,
  voteExperienceController
);

export default router;
