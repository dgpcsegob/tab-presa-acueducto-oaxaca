import React, { useState } from "react";
import InfoBox, { InfoBoxSection } from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import "./App.css";

// Orden inicial: índice 0 = arriba del panel = encima en el mapa
const INITIAL_SECTION_ORDERS: string[][] = [
  [
    "acueducton",
    "plantap",
    "acueducto",
    "buffer20m",
    "afect_buffer20m",
    "presa",
    "municipios",
    "loc",
    "comind",
    "locvillasola",
    "lrvillasola",
    "perimetrales",
    "perimetralesnc",
  ],
  ["LocalidadesSedeINPI"],
];

const App: React.FC = () => {
  const [sectionOrders, setSectionOrders] = useState<string[][]>(
    INITIAL_SECTION_ORDERS,
  );

  const handleReorder = (sectionIdx: number, newIds: string[]) => {
    setSectionOrders((prev) => {
      const next = [...prev];
      next[sectionIdx] = newIds;
      return next;
    });
  };

  const layerOrder = sectionOrders.flat();

  const [layersVisibility, setLayersVisibility] = useState<
    Record<string, boolean>
  >({
    acueducton: true,
    plantap: true,
    acueducto: false,
    buffer20m: false,
    afect_buffer20m: false,
    presa: true,
    LocalidadesSedeINPI: false,
    comind: true,
    locvillasola: false,
    lrvillasola: false,
    perimetrales: false,
    perimetralesnc: false,
    municipios: false,
    loc: false,
  });
  const [layersOpacity, setLayersOpacity] = useState<Record<string, number>>({
    acueducton: 0.8,
    plantap: 1,
    acueducto: 0.5,
    buffer20m: 0.4,
    afect_buffer20m: 0.8,
    presa: 1,
    LocalidadesSedeINPI: 1,
    comind: 1,
    locvillasola: 0.7,
    lrvillasola: 0.8,
    perimetrales: 0.5,
    perimetralesnc: 0.5,
    municipios: 0.4,
    loc: 0.7,
  });
  /*== Manejar el toggle de visibilidad de capas ===*/
  const handleToggle = (id: string) => {
    setLayersVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleOpacityChange = (id: string, value: number) => {
    setLayersOpacity((prev) => ({ ...prev, [id]: value }));
  };

  const mkItem = (
    id: string,
    label: string,
    color: string,
    shape: "circle" | "square",
  ) => ({
    id,
    label,
    color,
    shape,
    switch: true as const,
    checked: layersVisibility[id],
    opacity: layersOpacity[id] ?? 1,
  });

  const sections: InfoBoxSection[] = [
    {
      title: "Capas del Proyecto",
      items: [
        mkItem("acueducton", "Acueducto (Nuevo)", "#00FFF0", "square"),
        mkItem(
          "acueducto",
          "Acueducto y Ramales (Anterior)",
          "#0011ffff",
          "square",
        ),
        mkItem(
          "plantap",
          "Planta Potabilizadora",
          "rgb(161, 0, 0)",
          "square",
        ),
        mkItem("buffer20m", "Buffer 20 mtrs", "#ff8585ff", "square"),
        mkItem(
          "afect_buffer20m",
          "Afectación buffer 20 mtrs",
          "#ff0000ff",
          "square",
        ),
        mkItem("presa", "Presa Mujer Solteca", "#4c9af3ff", "square"),
        mkItem("municipios", "Municipios", "#9593ffff", "square"),
        mkItem("loc", "Localidades (Buffer 5km)", "#ff2fd2ff", "square"),
        mkItem(
          "comind",
          "Comunidades (Área de influencia)",
          "#df7649",
          "circle",
        ),
        mkItem("locvillasola", "Localidades Villa Sola", "#f3ff4dff", "square"),
        mkItem("lrvillasola", "Localidades Rurales", "#08c567ff", "circle"),
        mkItem(
          "perimetrales",
          "Núcleos Agrarios Certificados",
          "#21f84fff",
          "square",
        ),
        mkItem(
          "perimetralesnc",
          "Núcleos Agrarios No Certificados",
          "#ff9e2fff",
          "square",
        ),
      ],
    },
    {
      title: "Comunidades Indígenas y Afromexicanas",
      items: [
        mkItem(
          "LocalidadesSedeINPI",
          "Pueblos Indígenas",
          "#ec3db8ff",
          "circle",
        ),
      ],
    },
  ];

  return (
    <div className="App">
      <InfoBox
        title="PRESA 'MUJER SOLTECA'"
        subtitle="(PASO ANCHO)"
        sections={sections}
        onToggle={handleToggle}
        onOpacityChange={handleOpacityChange}
        onReorder={handleReorder}
      />
      <Map
        layersVisibility={layersVisibility}
        layersOpacity={layersOpacity}
        layerOrder={layerOrder}
      />
    </div>
  );
};

export default App;
