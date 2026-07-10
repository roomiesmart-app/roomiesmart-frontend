// ============================================================
// RoomieSmart — Módulo WASM de finanzas compartidas
// AssemblyScript (compila a WebAssembly con `npm run asbuild`).
//
// Diseño: interfaz 100% escalar (patrón acumulador). Evita pasar
// arrays por memoria lineal, así el frontend puede instanciar el
// .wasm sin @assemblyscript/loader ni runtime exportado.
// ============================================================

let houseTotal: f64 = 0;
let youOwe: f64 = 0;
let owedToYou: f64 = 0;

/** Reinicia el acumulador antes de procesar una lista de gastos. */
export function reset(): void {
  houseTotal = 0;
  youOwe = 0;
  owedToYou = 0;
}

/** División equitativa de un monto entre N miembros. */
export function splitEqual(total: f64, members: i32): f64 {
  if (members <= 0) return 0;
  return total / members;
}

/**
 * Procesa un gasto y devuelve la cuota por persona.
 * paidByMe: 1 si el usuario actual pagó este gasto, 0 si lo pagó otro.
 * - Si pagué yo: los demás me deben (monto - mi cuota).
 * - Si pagó otro: yo debo mi cuota.
 */
export function addExpense(amount: f64, paidByMe: i32, members: i32): f64 {
  if (members <= 0) return 0;
  houseTotal += amount;
  const share = amount / members;
  if (paidByMe == 1) {
    owedToYou += amount - share;
  } else {
    youOwe += share;
  }
  return share;
}

export function getHouseTotal(): f64 {
  return houseTotal;
}

export function getYouOwe(): f64 {
  return youOwe;
}

export function getOwedToYou(): f64 {
  return owedToYou;
}
