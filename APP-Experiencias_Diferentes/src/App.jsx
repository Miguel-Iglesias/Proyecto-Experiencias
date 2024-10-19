import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Register from "./pages/Register";
import ValidateUser from "./pages/ValidateUser";
import Login from "./pages/Login";
import RecoverPassword from "./pages/RecoverPassword";
import ModifyPassword from "./pages/ModifyPassword";
import NewPassword from "./pages/NewPassword";
import UserProfile from "./pages/UserProfile";
import ProfileUpdate from "./pages/ProfileUpdate";
import Experience from "./pages/Experience";
import CreateExperience from "./pages/CreateExperience";
import EditExperience from "./pages/EditExperience";
import ExperienceById from "./pages/ExperienceById";
import PageNotFound from "./components/PageNotFoundComponent";
import ChangePassword from "./pages/ChangePassword.jsx";
import AdminReservationsList from "./pages/AdminReservationsList";
import UserReservedExperiences from "./pages/UserReservedExperiences.jsx";

import "./App.css";

function App() {
  return (
    <>
      <header className="flex place-content-between bg-slate-500 bg-opacity-50 p-2 fixed bottom-0 w-full md:static md:w-auto">
        <Header />
      </header>
      <main className="flex-grow bg-[url('/src/assets/imageExperienciasDiferentes.jpg')] bg-cover">
        <Routes>
          <Route path="/users/register" element={<Register />} />
          <Route
            path="/users/validate/:registrationCode"
            element={<ValidateUser />}
          />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/recover-password" element={<RecoverPassword />} />
          <Route path="/users/modify-password" element={<ModifyPassword />} />
          <Route path="/users/password" element={<NewPassword />} />
          <Route path="/users/change-password" element={<ChangePassword />} />
          <Route path="/users/profile" element={<UserProfile />} />
          <Route path="/users/edit-profile" element={<ProfileUpdate />} />
          <Route
            path="/experiencias/:experienceId"
            element={<ExperienceById />}
          />
          <Route path="/experiencias/create" element={<CreateExperience />} />
          <Route
            path="/experiencias/edit/:experienceId"
            element={<EditExperience />}
          />
          <Route
            path="/admin/experiences"
            element={<AdminReservationsList />}
          />
          <Route
            path="/experiencias/reservedExperiences"
            element={<UserReservedExperiences />}
          />
          <Route path="/" element={<Experience />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <footer className="text-center hidden md:block">
        <p>PFB Hack A Boss - Grupo F</p>
        <p>
          Alberto Jimenez - Ana Perez - Miguel Iglesias - Noelia Camelia -
          Ricardo Hidalgo - Tomás Vázquez
        </p>
      </footer>
    </>
  );
}

export default App;
