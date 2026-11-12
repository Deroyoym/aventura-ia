import type { ReactNode, SVGProps } from "react";
import { AMENAZA_MAX, UMBRALES_AMENAZA } from "@/lib/game/contenido";
import type { Enfoque } from "@/lib/game/tipos";

// Piezas chicas compartidas: iconos de línea, ornamentos y medidores.

type IconoProps = SVGProps<SVGSVGElement> & { tam?: number };

function Trazo({ tam = 20, children, ...resto }: IconoProps & { children: ReactNode }) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...resto}
    >
      {children}
    </svg>
  );
}

export const IconoEspada = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M20 4l-9.5 9.5M20 4h-4l-7.5 7.5 4 4L20 8z" />
    <path d="M7 12l5 5M9.5 14.5L4 20M4 20l1.5-3.5M4 20l3.5-1.5" />
  </Trazo>
);

export const IconoOjo = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </Trazo>
);

export const IconoDialogo = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M4 5.5h16v10.5H11l-4.5 3.8V16H4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Trazo>
);

export const IconoFarol = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M9 3.5h6M12 3.5V6M8 6h8l1.5 3v8L16 20H8l-1.5-3V9z" />
    <path d="M12 10.5c1.6 1.6 1.9 2.8 1.9 3.6a1.9 1.9 0 01-3.8 0c0-.8.3-2 1.9-3.6z" fill="currentColor" stroke="none" />
  </Trazo>
);

export const IconoCorazon = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z" />
  </Trazo>
);

export const IconoLibro = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5V20" />
  </Trazo>
);

export const IconoBruma = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M3 8c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 13c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M5 18c1.7-1.2 3.3-1.2 5 0s3.3 1.2 5 0 2.7-1 4-.4" />
  </Trazo>
);

export const IconoPluma = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M20 4c-7 0-12 4.5-13 12l-2 4M7 16c5 0 9-2.5 11-7M10 12.5l4-.5" />
  </Trazo>
);

export const IconoHuella = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M12 12.5c-2.5 0-4.5 2-4.5 4 0 1.6 1.3 2.5 2.7 2.2.7-.15 1.2-.4 1.8-.4s1.1.25 1.8.4c1.4.3 2.7-.6 2.7-2.2 0-2-2-4-4.5-4z" />
    <ellipse cx="6.5" cy="10" rx="1.5" ry="2" />
    <ellipse cx="10" cy="6.5" rx="1.5" ry="2" />
    <ellipse cx="14" cy="6.5" rx="1.5" ry="2" />
    <ellipse cx="17.5" cy="10" rx="1.5" ry="2" />
  </Trazo>
);

export const IconoCompartir = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M12 15V4M8 7.5L12 4l4 3.5M5 12.5V19h14v-6.5" />
  </Trazo>
);

export const IconoCerrar = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Trazo>
);

export const IconoSusurro = (p: IconoProps) => (
  <Trazo {...p}>
    <path d="M9 18.5c-2.5-1.2-4-3.8-4-6.7A6.8 6.8 0 0111.8 5c3.7 0 6.7 2.8 6.7 6.3 0 2.2-1.4 3.7-3 3.7-1.5 0-2-1.2-2-2.3 0-1.5-.7-2.7-2-2.7" />
    <path d="M9 18.5c0 1.4 1 2.5 2.5 2.5" />
  </Trazo>
);

export const ICONO_ENFOQUE: Record<Enfoque, (p: IconoProps) => ReactNode> = {
  combate: IconoEspada,
  ingenio: IconoOjo,
  dialogo: IconoDialogo,
};

/** Florón entre secciones. */
export function Ornamento({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 16"
      className={`mx-auto h-4 w-40 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden
    >
      <path d="M2 8h52M106 8h52" strokeLinecap="round" opacity=".6" />
      <path d="M80 2c3 3 3 9 0 12-3-3-3-9 0-12z" fill="currentColor" stroke="none" />
      <path d="M62 8c4-5 10-5 14 0-4 5-10 5-14 0zM84 8c4-5 10-5 14 0-4 5-10 5-14 0z" opacity=".8" />
      <circle cx="58" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="102" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Puntos() {
  return (
    <span className="puntos" aria-hidden>
      <span>·</span>
      <span>·</span>
      <span>·</span>
    </span>
  );
}

/** Corazones de vida: llenos, vacíos y el número exacto para lectores de pantalla. */
export function Vida({ vida, max, compacta = false }: { vida: number; max: number; compacta?: boolean }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, vida / max)) : 0;
  const color = pct > 0.5 ? "var(--color-musgo)" : pct > 0.25 ? "var(--color-ambar)" : "var(--color-brasa)";
  return (
    <span className="inline-flex items-center gap-1.5" title={`Vida ${vida} de ${max}`}>
      <IconoCorazon tam={compacta ? 13 : 15} style={{ color, fill: pct > 0 ? color : "none" }} />
      <span className="tabular-nums" aria-label={`Vida ${vida} de ${max}`}>
        {vida}
        <span className="opacity-60">/{max}</span>
      </span>
    </span>
  );
}

/** Medidor de La Bruma: diez velas que se van apagando en niebla. */
export function MedidorAmenaza({ valor }: { valor: number }) {
  const umbral = [...UMBRALES_AMENAZA].reverse().find((u) => valor >= u.valor);
  return (
    <div
      className="flex items-center gap-2"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={AMENAZA_MAX}
      aria-valuenow={valor}
      aria-label={`La Bruma: ${valor} de ${AMENAZA_MAX}`}
      title={umbral ? umbral.titulo : "La Bruma"}
    >
      <IconoBruma tam={16} className={valor >= 7 ? "text-brasa" : "text-bruma"} />
      <div className="flex gap-[3px]">
        {Array.from({ length: AMENAZA_MAX }, (_, i) => {
          const lleno = i < valor;
          const color = i >= 6 ? "var(--color-brasa)" : i >= 3 ? "var(--color-ambar)" : "var(--color-bruma)";
          return (
            <span
              key={i}
              className="h-3 w-[7px] rounded-[2px] transition-colors duration-700"
              style={{ background: lleno ? color : "#ffffff1c", boxShadow: lleno && i >= 6 ? "0 0 6px #c2552f99" : undefined }}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Colores que identifican a cada jugador en la bitácora. */
export const COLOR_JUGADOR: Record<number, string> = {
  1: "var(--color-sangre)",
  2: "var(--color-cardenillo)",
  3: "#c9953a",
  4: "#8f6fc2",
  5: "#5f9a6a",
  6: "#c46f8f",
};
