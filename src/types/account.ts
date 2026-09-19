export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export type AccountStatus = 'Active' | 'Inactive' | 'Pending';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountFilter {
  search: string;
  type: string;
  status: string;
  category: string;
}
