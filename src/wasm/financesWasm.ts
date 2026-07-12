interface FinancesWasmExports {
  reset(): void;
  splitEqual(total: number, members: number): number;
  addExpense(
    amount: number,
    paidByMe: number,
    participants: number,
    iParticipate: number,
    iHavePaid: number,
    unpaidOthers: number,
  ): number;
  getHouseTotal(): number;
  getYouOwe(): number;
  getOwedToYou(): number;
  getMyShareTotal(): number;
}

let instancePromise: Promise<FinancesWasmExports | null> | null = null;

async function loadWasm(): Promise<FinancesWasmExports | null> {
  try {
    const response = await fetch("/wasm/finances.wasm");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const imports = {
      env: {
        abort: () => {
          throw new Error("Abort desde el módulo WASM");
        },
      },
    };

    let instance: WebAssembly.Instance;
    try {

      const streamed = await WebAssembly.instantiateStreaming(
        response.clone(),
        imports,
      );
      instance = streamed.instance;
    } catch {

      const bytes = await response.arrayBuffer();
      const compiled = await WebAssembly.instantiate(bytes, imports);
      instance = compiled.instance;
    }

    const exports = instance.exports as unknown as FinancesWasmExports;

    // Un binario viejo (sin participantes o sin pagos por gasto) no sirve: usar fallback JS
    if (
      typeof exports.getMyShareTotal !== "function" ||
      exports.addExpense.length < 6
    ) {
      console.warn("🧮 WASM desactualizado, usando fallback JS.");
      return null;
    }

    console.log("🧮 Módulo WASM de finanzas cargado.");
    return exports;
  } catch (error) {
    console.warn("🧮 WASM no disponible, usando fallback JS:", error);
    return null;
  }
}

function getFinancesWasm(): Promise<FinancesWasmExports | null> {
  if (!instancePromise) instancePromise = loadWasm();
  return instancePromise;
}

export interface ExpenseInput {
  amount: number;
  paidByMe: boolean;

  // Cantidad de personas entre las que se divide este gasto
  participantCount: number;

  // Si el usuario actual es una de esas personas
  iParticipate: boolean;

  // Si el usuario actual ya pagó su parte al pagador
  iHavePaid: boolean;

  // Participantes distintos del pagador que aún no han pagado su parte
  unpaidOthersCount: number;
}

export interface FinanceSummary {
  houseTotal: number;
  youOwe: number;
  owedToYou: number;

  // Suma de las partes que me corresponden en los gastos donde participo
  myShareTotal: number;

  shares: number[];
}

export async function computeFinanceSummary(
  expenses: ExpenseInput[],
): Promise<FinanceSummary> {
  const wasm = await getFinancesWasm();

  if (wasm) {
    wasm.reset();
    const shares = expenses.map((expense) =>
      wasm.addExpense(
        expense.amount,
        expense.paidByMe ? 1 : 0,
        Math.max(expense.participantCount, 1),
        expense.iParticipate ? 1 : 0,
        expense.iHavePaid ? 1 : 0,
        Math.max(expense.unpaidOthersCount, 0),
      ),
    );
    return {
      houseTotal: wasm.getHouseTotal(),
      youOwe: wasm.getYouOwe(),
      owedToYou: wasm.getOwedToYou(),
      myShareTotal: wasm.getMyShareTotal(),
      shares,
    };
  }

  let houseTotal = 0;
  let youOwe = 0;
  let owedToYou = 0;
  let myShareTotal = 0;
  const shares = expenses.map((expense) => {
    const participants = Math.max(expense.participantCount, 1);
    houseTotal += expense.amount;
    const share = expense.amount / participants;

    if (expense.iParticipate) myShareTotal += share;

    if (expense.paidByMe) {
      owedToYou += share * Math.max(expense.unpaidOthersCount, 0);
    } else if (expense.iParticipate && !expense.iHavePaid) {
      youOwe += share;
    }
    return share;
  });

  return { houseTotal, youOwe, owedToYou, myShareTotal, shares };
}
