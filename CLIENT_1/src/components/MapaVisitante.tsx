import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../services/apiMapa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import FooterVisitante from "./FooterVisitante";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 📍 Icono para lugares
const lugarIcon = L.divIcon({
  className: "custom-lugar-icon",
  html: `<div style="font-size: 28px;">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function MapaVisitante() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const polylineRef = useRef<L.Polyline | null>(null);
  const lugaresLayerRef = useRef<L.LayerGroup | null>(null);

  const [puntos, setPuntos] = useState<[number, number][]>([]);
  const [lugares, setLugares] = useState<any[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  // --------------------------------------------------------------------
  // 🗺 Inicializar Mapa
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      [5.794425, -73.062991],
      17
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    return () => map.remove();
  }, []);

  // --------------------------------------------------------------------
  // 🔌 Conectar WebSocket y recibir ubicaciones EN TIEMPO REAL
  // --------------------------------------------------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");
    wsRef.current = ws;

    ws.onopen = () => console.log("Visitante conectado al WS ✔");

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.warn("Mensaje WS inválido");
        return;
      }

      if (data.type === "update" && data.position) {
        const { lat, lng } = data.position;

        setPuntos((prev) => [...prev, [lat, lng]]);
      }
    };

    ws.onclose = () => console.log("WS desconectado (visitante)");

    return () => ws.close();
  }, []);

  // --------------------------------------------------------------------
  // ✏️ Dibujar ruta en tiempo real
  // --------------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (polylineRef.current) {
      // actualizar polyline
      polylineRef.current.setLatLngs(puntos);
    } else {
      // crear polyline
      polylineRef.current = L.polyline(puntos, { color: "blue" }).addTo(map);
    }

    // mover mapa al último punto
    if (puntos.length > 0) {
      const last = puntos[puntos.length - 1];
      map.setView(last, 17);
    }
  }, [puntos]);

  // --------------------------------------------------------------------
  // 📌 Cargar lugares de la BD
  // --------------------------------------------------------------------
  const cargarLugares = async () => {
    try {
      const resp = await api.getLugares();
      const data = Array.isArray(resp) ? resp : resp.data ?? [];
      setLugares(data);

      const map = mapRef.current;
      if (!map) return;

      if (lugaresLayerRef.current) {
        lugaresLayerRef.current.clearLayers();
      } else {
        lugaresLayerRef.current = L.layerGroup().addTo(map);
      }

      data.forEach((lugar: any) => {
        L.marker(
          [
            parseFloat(lugar.Latitud),
            parseFloat(lugar.Longitud),
          ],
          { icon: lugarIcon }
        )
          .addTo(lugaresLayerRef.current!)
          .bindPopup(`<b>${lugar.Nombre}</b><br>${lugar.Descripcion ?? ""}`);
      });
    } catch (err) {
      console.error("Error cargando lugares:", err);
    }
  };

  // --------------------------------------------------------------------
  // 📂 Cargar una ruta guardada en la BD
  // --------------------------------------------------------------------
  const cargarRuta = async () => {
    try {
      const rutas = await api.getRutas();
      if (!Array.isArray(rutas) || rutas.length === 0)
        return alert("No hay rutas disponibles.");

      const lista = rutas
        .map((r: any) => `${r.IdRuta}: ${r.Nombre}`)
        .join("\n");

      const input = prompt(`Selecciona ID de ruta:\n${lista}`);
      const id = Number(input);

      if (!id || isNaN(id)) return;

      const detalle = await api.getRutaDetalle(id);

      if (!Array.isArray(detalle) || detalle.length === 0)
        return alert("Esta ruta no tiene puntos.");

      const coords = detalle.map((p: any) => [
        parseFloat(p.Latitud),
        parseFloat(p.Longitud),
      ]);

      setPuntos(coords);
    } catch (err) {
      console.error("Error cargando ruta:", err);
    }
  };

  // --------------------------------------------------------------------
  // 🧹 Limpiar ruta del mapa
  // --------------------------------------------------------------------
  const limpiar = () => {
    setPuntos([]);

    if (polylineRef.current && mapRef.current) {
      mapRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
  };

  // --------------------------------------------------------------------
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      ></div>

      <FooterVisitante
        onCargar={cargarRuta}
        onCargarLugares={cargarLugares}
        onSimular={() => {}}
        onLimpiar={limpiar}
        puntos={puntos}
      />
    </div>
  );
}
