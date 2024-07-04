import updateActivationService from "../../services/updateActivationService.js";



const experienceActivationController = async (req, res, next) => {
    try {

        const experienceId = req.params.experience.id || req.experience?.id;
        const {active} = req.body;

        await updateActivationService(experienceId, active);

        res.send({
            status: "ok",
            message: "Estado de activación modificado correctamente"
        });
        
    } catch (error) {
        next(error);
    }
}

export default experienceActivationController;

