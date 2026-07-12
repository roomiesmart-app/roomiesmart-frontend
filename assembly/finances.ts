let houseTotal: f64 = 0;
let youOwe: f64 = 0;
let owedToYou: f64 = 0;

export function reset(): void {
  houseTotal = 0;
  youOwe = 0;
  owedToYou = 0;
}

export function splitEqual(total: f64, members: i32): f64 {
  if (members <= 0) return 0;
  return total / members;
}

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
