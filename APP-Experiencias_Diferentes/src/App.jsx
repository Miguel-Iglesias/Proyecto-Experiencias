import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ValidateUser from "./pages/ValidateUser";
import Login from "./pages/Login";
import RecoverPassword from "./pages/RecoverPassword";
import NewPassword from "./pages/NewPassword";
import CreateExperience from "./pages/CreateExperience";
import ExperienceById from "./pages/ExperienceById";
import ExperienceState from "./pages/ExperienceState";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/users/register" element={<Register />} />
        <Route
          path="/users/validate/:registrationCode"
          element={<ValidateUser />}
        />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/recover-password" element={<RecoverPassword />} />
        <Route path="/users/password" element={<NewPassword />} />
        <Route
          path="/experiencias/:experienceId"
          element={<ExperienceById />}
        />
        <Route
          path="/experiencias/:experienceId/experienceState"
          element={<ExperienceState />}
        />
        <Route path="/experiencias/create" element={<CreateExperience />} />
      </Routes>
    </>
  );
}

export default App;
