export type MappingStatus = 'Mapped' | 'Pending' | 'Conflict' | 'Unmapped';
export type MappingConfidence = 'High' | 'Medium' | 'Low' | 'Manual';

export interface MappingRule {
  id: string;
  name: string;
  productCategory: string;
  targetAccountCode: string;
  targetAccountName: string;
  priority: number;
  isActive: boolean;
  matchingCriteria: 'Exact Category' | 'SKU Prefix' | 'Keywords' | 'Price Tier';
  valuePattern: string;
}

export interface AccountMappingItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  productCategory: string;
  price: number;
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  status: MappingStatus;
  confidence: MappingConfidence;
  ruleName?: string;
  lastUpdated: string;
}

export interface MappingFilter {
  search: string;
  status: string;
  category: string;
}
