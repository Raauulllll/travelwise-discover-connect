import type { Expense, GroupMember, Settlement } from "./types";

/** Net balance per member: positive = is owed money, negative = owes money. */
export function netBalances(members: GroupMember[], expenses: Expense[]): Record<string, number> {
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m.id] = 0));

  for (const expense of expenses) {
    balances[expense.paidBy] = (balances[expense.paidBy] ?? 0) + expense.amount;
    if (expense.splitMode === "equal") {
      const share = expense.amount / members.length;
      members.forEach((m) => (balances[m.id] -= share));
    } else {
      const total = Object.values(expense.shares).reduce((a, b) => a + b, 0) || 1;
      members.forEach((m) => {
        const owed = ((expense.shares[m.id] ?? 0) / total) * expense.amount;
        balances[m.id] -= owed;
      });
    }
  }

  Object.keys(balances).forEach((k) => (balances[k] = Math.round(balances[k] * 100) / 100));
  return balances;
}

/** Greedy settlement simplification: fewest transfers that clear all balances. */
export function simplifySettlements(balances: Record<string, number>): Settlement[] {
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.5)
    .map(([id, v]) => ({ id, amount: -v }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.5)
    .map(([id, v]) => ({ id, amount: v }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    if (pay > 0.5) {
      settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(pay) });
    }
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount <= 0.5) i++;
    if (creditors[j].amount <= 0.5) j++;
  }
  return settlements;
}
