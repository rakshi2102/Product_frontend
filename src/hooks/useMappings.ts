import { useState, useEffect, useCallback } from 'react';
import type { AccountMappingItem, MappingFilter, MappingRule } from '../types/mapping';
import { mappingApi } from '../services/mappingApi';

export function useMappings(initialFilter?: MappingFilter) {
  const [mappings, setMappings] = useState<AccountMappingItem[]>([]);
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MappingFilter>(initialFilter || {
    search: '',
    status: 'All',
    category: 'All'
  });

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mappingApi.getMappings(filter);
      const rulesData = await mappingApi.getRules();
      setMappings(data);
      setRules(rulesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const updateMapping = async (id: string, accountId: string, accountCode: string, accountName: string, accountType: string) => {
    const updated = await mappingApi.updateMapping(id, accountId, accountCode, accountName, accountType);
    await fetchMappings();
    return updated;
  };

  const runAutoMapping = async () => {
    setLoading(true);
    try {
      const result = await mappingApi.runAutomatedMapping();
      await fetchMappings();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    mappings,
    rules,
    loading,
    error,
    filter,
    setFilter,
    refresh: fetchMappings,
    updateMapping,
    runAutoMapping
  };
}
