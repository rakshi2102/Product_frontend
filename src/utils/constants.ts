import type { Account } from '../types/account';
import type { Product } from '../types/product';
import type { MappingRule, AccountMappingItem } from '../types/mapping';
import type { ValidationError } from '../types/validation';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-4001',
    code: '4001',
    name: 'Hardware Sales Revenue',
    type: 'Revenue',
    category: 'Sales',
    balance: 452800.00,
    currency: 'USD',
    status: 'Active',
    description: 'Revenue generated from standard hardware products',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-10T14:20:00Z'
  },
  {
    id: 'acc-4002',
    code: '4002',
    name: 'Software Subscription Income',
    type: 'Revenue',
    category: 'SaaS / Recurring',
    balance: 289400.00,
    currency: 'USD',
    status: 'Active',
    description: 'Monthly and annual recurring SaaS license revenue',
    createdAt: '2026-01-15T09:10:00Z',
    updatedAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'acc-4003',
    code: '4003',
    name: 'Professional Services Revenue',
    type: 'Revenue',
    category: 'Services',
    balance: 114500.00,
    currency: 'USD',
    status: 'Active',
    description: 'Consulting, onboarding, and customized setup fees',
    createdAt: '2026-02-01T08:30:00Z',
    updatedAt: '2026-09-14T16:45:00Z'
  },
  {
    id: 'acc-5001',
    code: '5001',
    name: 'Cost of Goods Sold - Hardware',
    type: 'Expense',
    category: 'COGS',
    balance: 215000.00,
    currency: 'USD',
    status: 'Active',
    description: 'Direct component and manufacturing costs',
    createdAt: '2026-01-15T09:20:00Z',
    updatedAt: '2026-09-08T10:15:00Z'
  },
  {
    id: 'acc-1200',
    code: '1200',
    name: 'Accounts Receivable',
    type: 'Asset',
    category: 'Current Assets',
    balance: 98450.00,
    currency: 'USD',
    status: 'Active',
    description: 'Outstanding invoices receivable from clients',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-09-18T18:00:00Z'
  },
  {
    id: 'acc-2100',
    code: '2100',
    name: 'Deferred Revenue Liability',
    type: 'Liability',
    category: 'Current Liabilities',
    balance: 64200.00,
    currency: 'USD',
    status: 'Active',
    description: 'Unearned revenue for prepaid annual contracts',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-09-15T09:30:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'HW-EVK-100',
    name: 'VMC Controller Node v2',
    category: 'Hardware',
    price: 1250.00,
    cost: 580.00,
    taxRate: 8.5,
    unit: 'pcs',
    status: 'Active',
    mappedAccountId: 'acc-4001',
    mappedAccountCode: '4001',
    mappedAccountName: 'Hardware Sales Revenue',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z'
  },
  {
    id: 'prod-002',
    sku: 'SW-ENT-001',
    name: 'Enterprise Fleet Dashboard License (Annual)',
    category: 'Software',
    price: 3600.00,
    cost: 150.00,
    taxRate: 0.0,
    unit: 'year',
    status: 'Active',
    mappedAccountId: 'acc-4002',
    mappedAccountCode: '4002',
    mappedAccountName: 'Software Subscription Income',
    createdAt: '2026-02-12T14:30:00Z',
    updatedAt: '2026-09-12T15:20:00Z'
  },
  {
    id: 'prod-003',
    sku: 'SV-ONS-500',
    name: 'On-site Precision Calibration Service',
    category: 'Services',
    price: 850.00,
    cost: 320.00,
    taxRate: 5.0,
    unit: 'service',
    status: 'Active',
    mappedAccountId: 'acc-4003',
    mappedAccountCode: '4003',
    mappedAccountName: 'Professional Services Revenue',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-09-14T10:00:00Z'
  },
  {
    id: 'prod-004',
    sku: 'HW-SNS-050',
    name: 'Multi-Axis Vibration Sensor Pack',
    category: 'Hardware',
    price: 340.00,
    cost: 140.00,
    taxRate: 8.5,
    unit: 'pack',
    status: 'Active',
    mappedAccountId: 'acc-4001',
    mappedAccountCode: '4001',
    mappedAccountName: 'Hardware Sales Revenue',
    createdAt: '2026-03-15T11:20:00Z',
    updatedAt: '2026-09-16T14:10:00Z'
  },
  {
    id: 'prod-005',
    sku: 'ACC-CBL-009',
    name: 'High-Temperature Optical Sensor Cable (5m)',
    category: 'Accessories',
    price: 95.00,
    cost: 28.00,
    taxRate: 8.5,
    unit: 'm',
    status: 'Draft',
    mappedAccountId: undefined,
    mappedAccountCode: undefined,
    mappedAccountName: undefined,
    createdAt: '2026-08-20T16:00:00Z',
    updatedAt: '2026-09-01T09:00:00Z'
  }
];

export const INITIAL_MAPPING_RULES: MappingRule[] = [
  {
    id: 'rule-101',
    name: 'Auto-Map Hardware Category',
    productCategory: 'Hardware',
    targetAccountCode: '4001',
    targetAccountName: 'Hardware Sales Revenue',
    priority: 1,
    isActive: true,
    matchingCriteria: 'Exact Category',
    valuePattern: 'Hardware'
  },
  {
    id: 'rule-102',
    name: 'Auto-Map Software Licenses',
    productCategory: 'Software',
    targetAccountCode: '4002',
    targetAccountName: 'Software Subscription Income',
    priority: 2,
    isActive: true,
    matchingCriteria: 'Exact Category',
    valuePattern: 'Software'
  },
  {
    id: 'rule-103',
    name: 'Auto-Map Professional Services',
    productCategory: 'Services',
    targetAccountCode: '4003',
    targetAccountName: 'Professional Services Revenue',
    priority: 3,
    isActive: true,
    matchingCriteria: 'Exact Category',
    valuePattern: 'Services'
  }
];

export const INITIAL_MAPPINGS: AccountMappingItem[] = [
  {
    id: 'map-001',
    productId: 'prod-001',
    productSku: 'HW-EVK-100',
    productName: 'VMC Controller Node v2',
    productCategory: 'Hardware',
    price: 1250.00,
    accountId: 'acc-4001',
    accountCode: '4001',
    accountName: 'Hardware Sales Revenue',
    accountType: 'Revenue',
    status: 'Mapped',
    confidence: 'High',
    ruleName: 'Auto-Map Hardware Category',
    lastUpdated: '2026-09-10T12:00:00Z'
  },
  {
    id: 'map-002',
    productId: 'prod-002',
    productSku: 'SW-ENT-001',
    productName: 'Enterprise Fleet Dashboard License (Annual)',
    productCategory: 'Software',
    price: 3600.00,
    accountId: 'acc-4002',
    accountCode: '4002',
    accountName: 'Software Subscription Income',
    accountType: 'Revenue',
    status: 'Mapped',
    confidence: 'High',
    ruleName: 'Auto-Map Software Licenses',
    lastUpdated: '2026-09-12T15:20:00Z'
  },
  {
    id: 'map-003',
    productId: 'prod-003',
    productSku: 'SV-ONS-500',
    productName: 'On-site Precision Calibration Service',
    productCategory: 'Services',
    price: 850.00,
    accountId: 'acc-4003',
    accountCode: '4003',
    accountName: 'Professional Services Revenue',
    accountType: 'Revenue',
    status: 'Mapped',
    confidence: 'High',
    ruleName: 'Auto-Map Professional Services',
    lastUpdated: '2026-09-14T10:00:00Z'
  },
  {
    id: 'map-004',
    productId: 'prod-004',
    productSku: 'HW-SNS-050',
    productName: 'Multi-Axis Vibration Sensor Pack',
    productCategory: 'Hardware',
    price: 340.00,
    accountId: 'acc-4001',
    accountCode: '4001',
    accountName: 'Hardware Sales Revenue',
    accountType: 'Revenue',
    status: 'Mapped',
    confidence: 'High',
    ruleName: 'Auto-Map Hardware Category',
    lastUpdated: '2026-09-16T14:10:00Z'
  },
  {
    id: 'map-005',
    productId: 'prod-005',
    productSku: 'ACC-CBL-009',
    productName: 'High-Temperature Optical Sensor Cable (5m)',
    productCategory: 'Accessories',
    price: 95.00,
    accountId: '',
    accountCode: 'UNMAPPED',
    accountName: 'Unassigned Account',
    accountType: 'None',
    status: 'Unmapped',
    confidence: 'Low',
    lastUpdated: '2026-09-01T09:00:00Z'
  }
];

export const INITIAL_VALIDATION_ERRORS: ValidationError[] = [
  {
    id: 'err-901',
    ruleId: 'VR-01',
    ruleName: 'Unmapped Active Product',
    entityType: 'Product',
    entityId: 'prod-005',
    entityReference: 'ACC-CBL-009 (High-Temperature Cable)',
    message: 'Product is active in catalog but has no GL revenue account mapped.',
    severity: 'Warning',
    status: 'Unresolved',
    detectedAt: '2026-09-18T10:30:00Z',
    suggestion: 'Assign account code 4001 or create an Accessories Revenue account.'
  },
  {
    id: 'err-902',
    ruleId: 'VR-02',
    ruleName: 'Zero Cost Anomaly',
    entityType: 'Product',
    entityId: 'prod-006',
    entityReference: 'DEMO-KIT-00',
    message: 'Product unit cost is set to $0.00 while pricing is $499.00.',
    severity: 'Info',
    status: 'Unresolved',
    detectedAt: '2026-09-17T14:15:00Z',
    suggestion: 'Verify standard unit cost BOM before closing monthly ledger.'
  }
];
