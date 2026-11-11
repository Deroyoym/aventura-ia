// El modelo devuelve un único objeto JSON, pero queremos mostrar la narración
// mientras se escribe. Como `narracion` es el primer campo, alcanza con leer
// esa cadena del JSON todavía incompleto.

const ESCAPES: Record<string, string> = {
  n: "\n",
  t: "\t",
  r: "",
  b: "",
  f: "",
  '"': '"',
  "\\": "\\",
  "/": "/",
};

/** Texto de `narracion` decodificado hasta donde llegó el JSON parcial. */
export function extraerNarracion(crudo: string): string {
  const inicio = /"narracion"\s*:\s*"/.exec(crudo);
  if (!inicio) return "";
  let i = inicio.index + inicio[0].length;
  let texto = "";
  while (i < crudo.length) {
    const c = crudo[i];
    if (c === '"') break;
    if (c !== "\\") {
      texto += c;
      i += 1;
      continue;
    }
    const siguiente = crudo[i + 1];
    // Escape cortado por el borde del trozo: se completa en el próximo.
    if (siguiente === undefined) break;
    if (siguiente === "u") {
      const hex = crudo.slice(i + 2, i + 6);
      if (hex.length < 4) break;
      if (/^[0-9a-fA-F]{4}$/.test(hex)) texto += String.fromCharCode(parseInt(hex, 16));
      i += 6;
      continue;
    }
    texto += ESCAPES[siguiente] ?? siguiente;
    i += 2;
  }
  return texto;
}
