import { useState, useEffect, useCallback } from 'react';
import type { Account, AccountFilter } from '../types/account';
import { accountApi } from '../services/accountApi';

export function useAccounts(initialFilter?: AccountFilter) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AccountFilter>(initialFilter || {
    search: '',
    type: 'All',
    status: 'All',
    category: 'All'
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountApi.getAccounts(filter);
      setAccounts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await accountApi.createAccount(accountData);
    await fetchAccounts();
    return created;
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    const updated = await accountApi.updateAccount(id, updates);
    await fetchAccounts();
    return updated;
  };

  const deleteAccount = async (id: string) => {
    await accountApi.deleteAccount(id);
    await fetchAccounts();
  };

  return {
    accounts,
    loading,
    error,
    filter,
    setFilter,
    refresh: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  };
}
