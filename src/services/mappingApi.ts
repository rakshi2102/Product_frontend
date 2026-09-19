import type { AccountMappingItem, MappingRule, MappingFilter } from '../types/mapping';
import { INITIAL_MAPPINGS, INITIAL_MAPPING_RULES } from '../utils/constants';

const STORAGE_MAPPINGS_KEY = 'v_mappings_data_v1';
const STORAGE_RULES_KEY = 'v_mapping_rules_v1';

function getStoredMappings(): AccountMappingItem[] {
  const data = localStorage.getItem(STORAGE_MAPPINGS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_MAPPINGS_KEY, JSON.stringify(INITIAL_MAPPINGS));
    return INITIAL_MAPPINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MAPPINGS;
  }
}

function saveStoredMappings(mappings: AccountMappingItem[]) {
  localStorage.setItem(STORAGE_MAPPINGS_KEY, JSON.stringify(mappings));
}

function getStoredRules(): MappingRule[] {
  const data = localStorage.getItem(STORAGE_RULES_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_RULES_KEY, JSON.stringify(INITIAL_MAPPING_RULES));
    return INITIAL_MAPPING_RULES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MAPPING_RULES;
  }
}

export const mappingApi = {
  async getMappings(filter?: MappingFilter): Promise<AccountMappingItem[]> {
    let mappings = getStoredMappings();
    if (!filter) return mappings;

    return mappings.filter(m => {
      const matchesSearch = !filter.search ||
        m.productName.toLowerCase().includes(filter.search.toLowerCase()) ||
        m.productSku.toLowerCase().includes(filter.search.toLowerCase()) ||
        m.accountCode.toLowerCase().includes(filter.search.toLowerCase()) ||
        m.accountName.toLowerCase().includes(filter.search.toLowerCase());

      const matchesStatus = !filter.status || filter.status === 'All' || m.status === filter.status;
      const matchesCategory = !filter.category || filter.category === 'All' || m.productCategory === filter.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  },

  async updateMapping(id: string, accountId: string, accountCode: string, accountName: string, accountType: string): Promise<AccountMappingItem> {
    const mappings = getStoredMappings();
    const index = mappings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Mapping record not found');

    const updated: AccountMappingItem = {
      ...mappings[index],
      accountId,
      accountCode,
      accountName,
      accountType,
      status: accountId ? 'Mapped' : 'Unmapped',
      confidence: 'Manual',
      lastUpdated: new Date().toISOString()
    };
    mappings[index] = updated;
    saveStoredMappings(mappings);
    return updated;
  },

  async getRules(): Promise<MappingRule[]> {
    return getStoredRules();
  },

  async runAutomatedMapping(): Promise<{ mappedCount: number; mappings: AccountMappingItem[] }> {
    const mappings = getStoredMappings();
    const rules = getStoredRules().filter(r => r.isActive);
    let mappedCount = 0;

    const updatedMappings = mappings.map(item => {
      if (item.status === 'Mapped') return item;

      // Find matching rule
      const rule = rules.find(r => r.productCategory.toLowerCase() === item.productCategory.toLowerCase());
      if (rule) {
        mappedCount++;
        return {
          ...item,
          accountId: `acc-${rule.targetAccountCode}`,
          accountCode: rule.targetAccountCode,
          accountName: rule.targetAccountName,
          accountType: 'Revenue',
          status: 'Mapped' as const,
          confidence: 'High' as const,
          ruleName: rule.name,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    });

    saveStoredMappings(updatedMappings);
    return { mappedCount, mappings: updatedMappings };
  }
};
