import type { Expense, GroupMember, Settlement } from "./types";

/** Net balance per member: positive = is owed money, negative = owes money. */
export function netBalances(members: GroupMember[], expenses: Expense[]): Record<string, number> {
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m.id] = 0));

  for (const expense of expenses) {
    balances[expense.paidBy] = (balances[expense.paidBy] ?? 0) + expense.amount;
    if (expense.splitMode === "equal") {
      const share = expense.amount / members.length;
      members.forEach((m) => (balances[m.id] = (balances[m.id] ?? 0) - share));
    } else {
      const total = Object.values(expense.shares).reduce((a, b) => a + b, 0) || 1;
      members.forEach((m) => {
        const owed = ((expense.shares[m.id] ?? 0) / total) * expense.amount;
        balances[m.id] = (balances[m.id] ?? 0) - owed;
      });
    }
  }

  Object.keys(balances).forEach((k) => (balances[k] = Math.round((balances[k] ?? 0) * 100) / 100));
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
    const debtor = debtors[i]!;
    const creditor = creditors[j]!;
    const pay = Math.min(debtor.amount, creditor.amount);
    if (pay > 0.5) {
      settlements.push({ from: debtor.id, to: creditor.id, amount: Math.round(pay) });
    }
    debtor.amount -= pay;
    creditor.amount -= pay;
    if (debtor.amount <= 0.5) i++;
    if (creditor.amount <= 0.5) j++;
  }
  return settlements;
}
