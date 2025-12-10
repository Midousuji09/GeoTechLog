// src/components/Navbar.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2e7d32" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* -------------------
            IZQUIERDA
        --------------------- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              "@media (max-width: 480px)": {
                fontSize: "16px",
              },
            }}
             onClick={() => navigate("/dashboard")}
          >
            GeoTech
          </Typography>
        </Box>

        

        {/* -------------------
            DERECHA
        --------------------- */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar alt="Perfil" src="/avatar.png">
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => navigate("/perfil")}>Perfil</MenuItem>
          <MenuItem onClick={() => navigate("/configuracion")}>Configuración</MenuItem>
          <MenuItem onClick={() => navigate("/")}>Cerrar sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
