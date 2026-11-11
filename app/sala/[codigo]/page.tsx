import type { Metadata } from "next";
import { Suspense } from "react";
import { Cargando, Sala } from "@/components/Sala";
import { normalizarCodigo } from "@/lib/protocolo";

export const metadata: Metadata = { title: "Sala · La Hora Trece" };

export default function Page({ params }: { params: Promise<{ codigo: string }> }) {
  return (
    <Suspense fallback={<Cargando />}>
      {params.then(({ codigo }) => (
        <Sala codigo={normalizarCodigo(codigo)} />
      ))}
    </Suspense>
  );
}
