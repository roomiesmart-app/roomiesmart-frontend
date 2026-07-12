let houseTotal: f64 = 0;
let youOwe: f64 = 0;
let owedToYou: f64 = 0;
let myShareTotal: f64 = 0;

export function reset(): void {
  houseTotal = 0;
  youOwe = 0;
  owedToYou = 0;
  myShareTotal = 0;
}

export function splitEqual(total: f64, members: i32): f64 {
  if (members <= 0) return 0;
  return total / members;
}

export function addExpense(
  amount: f64,
  paidByMe: i32,
  participants: i32,
  iParticipate: i32,
): f64 {
  if (participants <= 0) return 0;
  houseTotal += amount;
  const share = amount / participants;

  if (iParticipate == 1) {
    myShareTotal += share;
  }

  if (paidByMe == 1) {
    // Si participo, me deben todo menos mi parte; si no participo, me deben el total
    owedToYou += iParticipate == 1 ? amount - share : amount;
  } else if (iParticipate == 1) {
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

export function getMyShareTotal(): f64 {
  return myShareTotal;
}
