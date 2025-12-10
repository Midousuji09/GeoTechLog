import React from "react";
import { Drawer } from "@mui/material";
import Mapa from "../components/Mapa2";
import LeftSidebar from "../components/LeftSidebar";

interface DashboardProps {
  sidebarOpen: boolean;
  onSidebarClose: () => void;
}

export default function Dashboard({ sidebarOpen, onSidebarClose }: DashboardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh", // 🔥 Usa la nueva unidad "dvh" para móviles
        overflow: "hidden",
      }}
    >
      {/* Contenedor del mapa */}
      <div
        style={{
          flex: 1, // 🔥 Ocupar TODO el espacio disponible
          position: "relative",
        }}
      >
        <Mapa />
      </div>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={onSidebarClose}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: "#f9fafb",
            color: "#111827",
            padding: 3,
          },
        }}
      >
        <LeftSidebar onClose={onSidebarClose} />
      </Drawer>
    </div>
  );
}
