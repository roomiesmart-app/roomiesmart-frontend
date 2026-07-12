interface FinancesWasmExports {
  reset(): void;
  splitEqual(total: number, members: number): number;
  addExpense(amount: number, paidByMe: number, members: number): number;
  getHouseTotal(): number;
  getYouOwe(): number;
  getOwedToYou(): number;
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

    console.log("🧮 Módulo WASM de finanzas cargado.");
    return instance.exports as unknown as FinancesWasmExports;
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
}

export interface FinanceSummary {
  houseTotal: number;
  youOwe: number;
  owedToYou: number;

  shares: number[];
}

export async function computeFinanceSummary(
  expenses: ExpenseInput[],
  members: number,
): Promise<FinanceSummary> {
  const safeMembers = Math.max(members, 1);
  const wasm = await getFinancesWasm();

  if (wasm) {
    wasm.reset();
    const shares = expenses.map((expense) =>
      wasm.addExpense(expense.amount, expense.paidByMe ? 1 : 0, safeMembers),
    );
    return {
      houseTotal: wasm.getHouseTotal(),
      youOwe: wasm.getYouOwe(),
      owedToYou: wasm.getOwedToYou(),
      shares,
    };
  }

  let houseTotal = 0;
  let youOwe = 0;
  let owedToYou = 0;
  const shares = expenses.map((expense) => {
    houseTotal += expense.amount;
    const share = expense.amount / safeMembers;
    if (expense.paidByMe) {
      owedToYou += expense.amount - share;
    } else {
      youOwe += share;
    }
    return share;
  });

  return { houseTotal, youOwe, owedToYou, shares };
}
