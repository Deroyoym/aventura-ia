import "server-only";
import type { EstadoServidor } from "@/lib/protocolo";

// Lectura de variables de entorno. Fuera de Vercel, lo que falte se reemplaza
// por un narrador simulado y un almacén en memoria para poder desarrollar sin
// claves. En Vercel no hay sustitutos: si falta algo, se avisa.

export function entorno() {
  const env = process.env;
  return {
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "",
    supabasePublica: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    supabaseSecreta: env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "",
    geminiClave: env.GEMINI_API_KEY || "",
    geminiModelo: env.GEMINI_MODEL || "",
    geminiRespaldo: env.GEMINI_MODEL_RESPALDO || "",
    enVercel: !!env.VERCEL,
  };
}

export function estadoServidor(): EstadoServidor {
  const e = entorno();
  const gemini = !!e.geminiClave && !!e.geminiModelo;
  const supabase = !!e.supabaseUrl && !!e.supabaseSecreta;
  const faltan: string[] = [];
  if (e.enVercel) {
    if (!e.geminiClave) faltan.push("GEMINI_API_KEY");
    if (!e.geminiModelo) faltan.push("GEMINI_MODEL");
    if (!e.supabaseUrl) faltan.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!e.supabaseSecreta) faltan.push("SUPABASE_SECRET_KEY");
  }
  return {
    listo: faltan.length === 0,
    faltan,
    narrador: gemini ? "gemini" : "simulado",
    almacen: supabase ? "supabase" : "memoria",
    modelo: e.geminiModelo || null,
    modeloRespaldo: e.geminiRespaldo || null,
  };
}
