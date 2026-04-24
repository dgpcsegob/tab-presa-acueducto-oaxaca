import React, { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./InfoBox.css";

type LegendItem = {
  id: string;
  label: string;
  color?: string;
  shape?: "circle" | "square";
  size?: number;
  switch?: boolean;
  checked?: boolean;
  opacity?: number;
};

export type InfoBoxSection = {
  title: string;
  items: LegendItem[];
};

type InfoBoxProps = {
  title: string;
  subtitle?: string;
  sections: InfoBoxSection[];
  onToggle?: (id: string) => void;
  onOpacityChange?: (id: string, value: number) => void;
  onReorder?: (sectionIdx: number, newIds: string[]) => void;
  initialOpen?: boolean;
};

/*== Toggle "gooey" (Uiverse) convertido a componente controlado ==*/
const GooToggle: React.FC<{
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}> = ({ checked, onChange, ariaLabel }) => {
  const id = useMemo(() => `goo-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <div className="toggle-container" aria-label={ariaLabel}>
      <input
        id={id}
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
        role="switch"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 292 142"
        className="toggle"
        aria-hidden="true"
      >
        <path
          d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
          className="toggle-background"
        />
        <rect
          rx="6"
          height="64"
          width="12"
          y="39"
          x="64"
          className="toggle-icon on"
        />
        <path
          d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z"
          fillRule="evenodd"
          className="toggle-icon off"
        />
        <g filter="url(#goo)">
          <rect
            fill="#fff"
            rx="29"
            height="58"
            width="116"
            y="42"
            x="13"
            className="toggle-circle-center"
          />
          <rect
            fill="#fff"
            rx="58"
            height="114"
            width="114"
            y="14"
            x="14"
            className="toggle-circle left"
          />
          <rect
            fill="#fff"
            rx="58"
            height="114"
            width="114"
            y="14"
            x="164"
            className="toggle-circle right"
          />
        </g>
        <filter id="goo">
          <feGaussianBlur stdDeviation="10" result="blur" in="SourceGraphic" />
          <feColorMatrix
            result="goo"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            in="blur"
            type="matrix"
          />
        </filter>
      </svg>
    </div>
  );
};

/*== Ítem arrastrable ==*/
const SortableItem: React.FC<{
  item: LegendItem;
  onToggle?: (id: string) => void;
  onOpacityChange?: (id: string, value: number) => void;
}> = ({ item, onToggle, onOpacityChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "rgba(0,124,191,0.06)" : undefined,
    borderRadius: isDragging ? 6 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="legend-row">
        {/* Handle de arrastre */}
        <span
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Arrastrar para reordenar"
        >
          ⠿
        </span>

        {item.shape && item.color && (
          <span
            className={`shape ${item.shape}`}
            style={{ backgroundColor: item.color, width: 12, height: 12 }}
          />
        )}

        <span className="legend-label">{item.label}</span>

        {item.switch && (
          <GooToggle
            checked={!!item.checked}
            onChange={() => onToggle && onToggle(item.id)}
            ariaLabel={`Activar/Desactivar ${item.label}`}
          />
        )}
      </div>

      {item.switch && item.checked && (
        <div className="opacity-row">
          {/* Sol — más transparente */}
          <svg className="opacity-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Más transparente</title>
            <circle cx="12" cy="12" r="4" fill="#9f2247"/>
            <line x1="12" y1="2"  x2="12" y2="5"  stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2"  y1="12" x2="5"  y2="12" stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="22" y2="12" stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19.78" y1="4.22"  x2="17.66" y2="6.34"  stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6.34"  y1="17.66" x2="4.22"  y2="19.78" stroke="#9f2247" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="range"
            className="opacity-slider"
            min={0}
            max={1}
            step={0.05}
            value={item.opacity ?? 1}
            onChange={(e) =>
              onOpacityChange &&
              onOpacityChange(item.id, parseFloat(e.target.value))
            }
            aria-label={`Opacidad de ${item.label}`}
          />
          {/* Luna — más opaco */}
          <svg className="opacity-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Más opaco</title>
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="#9f2247"/>
          </svg>
        </div>
      )}
    </div>
  );
};

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  subtitle,
  sections,
  onToggle,
  onOpacityChange,
  onReorder,
  initialOpen = true,
}) => {
  const [open, setOpen] = useState(initialOpen);

  // Estado de orden por sección (índice → array de ids)
  const [sectionOrders, setSectionOrders] = useState<string[][]>(() =>
    sections.map((s) => s.items.map((i) => i.id)),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (sectionIdx: number) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSectionOrders((prev) => {
      const next = prev.map((arr) => [...arr]);
      const order = next[sectionIdx];
      const oldIndex = order.indexOf(String(active.id));
      const newIndex = order.indexOf(String(over.id));
      next[sectionIdx] = arrayMove(order, oldIndex, newIndex);
      onReorder?.(sectionIdx, next[sectionIdx]);
      return next;
    });
  };

  return (
    <>
      {/*== Pestaña lateral cuando el panel está oculto ==*/}
      {!open && (
        <button
          className="floating-reveal-btn"
          onClick={() => setOpen(true)}
          aria-label="Mostrar panel"
          title="Mostrar panel"
        >
          <span className="reveal-label">Mostrar panel</span>
        </button>
      )}

      <aside
        className={`info-box ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        <header className="info-header">
          <div className="titles">
            <h2 className="info-title">{title}</h2>
            {subtitle && <p className="info-subtitle">{subtitle}</p>}
          </div>

          {/*== Botón para ocultar ==*/}
          <button
            className="side-toggle"
            onClick={() => setOpen(false)}
            aria-label="Ocultar panel"
            title="Ocultar panel"
          >
            <span className="chev left" />
          </button>
        </header>

        <div className="info-content">
          {sections.map((section, sIdx) => {
            const order = sectionOrders[sIdx] ?? section.items.map((i) => i.id);
            const itemMap = Object.fromEntries(section.items.map((i) => [i.id, i]));
            const orderedItems = order.map((id) => itemMap[id]).filter(Boolean);

            return (
              <section className="legend-section" key={sIdx}>
                <div className="legend-title">{section.title}</div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd(sIdx)}
                >
                  <SortableContext
                    items={order}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedItems.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        onOpacityChange={onOpacityChange}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </section>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default InfoBox;
