import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Documento: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔵 Loading elegante
    Swal.fire({
      title: "Creando cuenta...",
      html: "Espera un momento por favor",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 🟢 Registro correcto
        Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: "Ahora puedes iniciar sesión",
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
        }).then(() => navigate("/"));
      } else {
        // 🔴 Error del backend
        Swal.fire({
          icon: "error",
          title: "Error al registrarse",
          text: data.error || "Revisa los datos e inténtalo nuevamente",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="earth-container">
        <div className="earth"></div>
        <div className="earth-glow"></div>
      </div>

      <div className="login-container">
        <h2 className="login-title">
          Crear cuenta en <span className="highlight">GeoTech</span>
        </h2>
        <p className="login-subtitle">Regístrate para acceder al sistema</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              name="Nombre"
              placeholder="Nombre completo"
              value={formData.Nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="Email"
              placeholder="Correo electrónico"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="Documento"
              placeholder="Documento de identidad"
              value={formData.Documento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="Password"
              placeholder="Contraseña"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="register-section">
          <p>¿Ya tienes cuenta?</p>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Iniciar sesión
          </button>
        </div>

        <p className="footer-text">© 2025 GeoTech. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default Register;
