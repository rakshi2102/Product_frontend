export type ProductStatus = 'Active' | 'Draft' | 'Archived';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  taxRate: number;
  unit: string;
  status: ProductStatus;
  mappedAccountId?: string;
  mappedAccountCode?: string;
  mappedAccountName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  search: string;
  category: string;
  status: string;
  mappingFilter: 'All' | 'Mapped' | 'Unmapped';
}
