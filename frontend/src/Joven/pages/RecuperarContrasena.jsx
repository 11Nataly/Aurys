import React, { useState } from "react";

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/correo/envio_correo_contrasena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Correo enviado correctamente.");
        setError("");
      } else {
        setError(data.error || "Ocurrió un error.");
        setMensaje("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión con el servidor.");
      setMensaje("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f4f9",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Recuperar Contraseña
        </h2>

        <label htmlFor="correo">Correo electrónico:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Enviar correo
        </button>

        {mensaje && <p style={{ color: "green", marginTop: "15px" }}>{mensaje}</p>}
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
      </form>
    </div>
  );
}
