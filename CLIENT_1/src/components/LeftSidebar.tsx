// src/components/LeftSidebar.tsx
import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LeftSidebarProps {
  onClose: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const go = (ruta: string) => {
    navigate(ruta);
    onClose();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Menú
      </Typography>

      <Button variant="outlined" onClick={() => go("/dashboard")}>
        Explorar
      </Button>

      <Button variant="outlined" onClick={() => go("/info")}>
        Información
      </Button>

      <Button variant="outlined" onClick={() => go("/contacto")}>
        Contacto
      </Button>

      {usuario?.rol === 1 && (
        <Button variant="outlined" onClick={() => go("/seguimiento")}>
          Seguimiento
        </Button>
      )}

      <Divider />


    </Box>
  );
};

export default LeftSidebar;
