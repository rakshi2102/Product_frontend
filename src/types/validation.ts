export type ValidationSeverity = 'Critical' | 'Warning' | 'Info';
export type ValidationStatus = 'Unresolved' | 'Resolved' | 'Ignored';

export interface ValidationError {
  id: string;
  ruleId: string;
  ruleName: string;
  entityType: 'Product' | 'Account' | 'Mapping' | 'Import';
  entityId: string;
  entityReference: string;
  message: string;
  severity: ValidationSeverity;
  status: ValidationStatus;
  detectedAt: string;
  suggestion?: string;
}

export interface ValidationSummary {
  totalChecked: number;
  validCount: number;
  criticalErrors: number;
  warnings: number;
  healthScore: number;
}
