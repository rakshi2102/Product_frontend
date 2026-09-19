import type { Account, AccountFilter } from '../types/account';
import { INITIAL_ACCOUNTS } from '../utils/constants';

const STORAGE_KEY = 'v_accounts_data_v1';

function getStoredAccounts(): Account[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
    return INITIAL_ACCOUNTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export const accountApi = {
  async getAccounts(filter?: AccountFilter): Promise<Account[]> {
    let accounts = getStoredAccounts();
    if (!filter) return accounts;

    return accounts.filter(acc => {
      const matchesSearch = !filter.search || 
        acc.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        acc.code.toLowerCase().includes(filter.search.toLowerCase()) ||
        acc.category.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesType = !filter.type || filter.type === 'All' || acc.type === filter.type;
      const matchesStatus = !filter.status || filter.status === 'All' || acc.status === filter.status;
      const matchesCategory = !filter.category || filter.category === 'All' || acc.category === filter.category;

      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });
  },

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const accounts = getStoredAccounts();
    const newAccount: Account = {
      ...account,
      id: `acc-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    accounts.unshift(newAccount);
    saveStoredAccounts(accounts);
    return newAccount;
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const accounts = getStoredAccounts();
    const index = accounts.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Account not found');
    
    const updated = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    accounts[index] = updated;
    saveStoredAccounts(accounts);
    return updated;
  },

  async deleteAccount(id: string): Promise<void> {
    const accounts = getStoredAccounts().filter(a => a.id !== id);
    saveStoredAccounts(accounts);
  }
};
