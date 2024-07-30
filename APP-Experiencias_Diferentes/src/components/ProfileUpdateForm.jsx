import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileUpdateForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos del perfil cuando el componente se monta
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"), // Añadir el token aquí
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setEmail(userData.email);
          setUsername(userData.username);
          setFirstname(userData.firstname);
          setLastname(userData.lastname);
        } else {
          const errorData = await response.json();
          toast.error(
            `Failed to load user data: ${errorData.message || "Unknown error"}`
          );
        }
      } catch (error) {
        toast.error("Error loading user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas cumplen con los requisitos
    if (
      newPassword &&
      (newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/\d/.test(newPassword) ||
        !/[¡!$%^&*()_+|~=`{}:";'<>¿?,.]/.test(newPassword))
    ) {
      toast.error("New password does not meet the requirements.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Añadir el token aquí
        },
        body: JSON.stringify({
          email,
          username,
          firstname,
          lastname,
          password,
          newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        // Opcional: Redirigir al usuario o limpiar el formulario
      } else {
        const textResponse = await response.text();
        let errorData = {};

        if (textResponse) {
          try {
            errorData = JSON.parse(textResponse); // Intentar analizar JSON
          } catch (jsonError) {
            toast.error("Failed to parse error response");
            return; // Salir si no se puede analizar el JSON
          }
        } else {
          toast.error("Received empty error response");
          return;
        }

        toast.error(
          `Failed to update profile: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Profile</h2>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        First Name:
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </label>
      <label>
        Current Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
      <ToastContainer />
    </form>
  );
};

export default ProfileUpdateForm;
