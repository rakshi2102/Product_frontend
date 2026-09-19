import type { ValidationError, ValidationSummary } from '../types/validation';
import { INITIAL_VALIDATION_ERRORS } from '../utils/constants';
import { apiFetch } from './apiClient';

const STORAGE_ERRORS_KEY = 'v_validation_errors_v1';

function getStoredErrors(): ValidationError[] {
  const data = localStorage.getItem(STORAGE_ERRORS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_ERRORS_KEY, JSON.stringify(INITIAL_VALIDATION_ERRORS));
    return INITIAL_VALIDATION_ERRORS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_VALIDATION_ERRORS;
  }
}

function saveStoredErrors(errors: ValidationError[]) {
  localStorage.setItem(STORAGE_ERRORS_KEY, JSON.stringify(errors));
}

export const validationApi = {
  async getValidationErrors(): Promise<ValidationError[]> {
    try {
      const res = await apiFetch<{ success: boolean; data: ValidationError[] }>('/audit/errors');
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStoredErrors();
  },

  async getSummary(): Promise<ValidationSummary> {
    try {
      const res = await apiFetch<{ success: boolean; data?: ValidationSummary; summary?: any }>('/audit/summary');
      if (res.success) {
        const sum = res.data || res.summary;
        if (sum) {
          const totalChecked = sum.totalRows || 150;
          const criticalErrors = sum.criticalErrors || sum.salesLedgerMismatch || 0;
          const warnings = sum.warnings || sum.rangeDeviations || 0;
          const validCount = Math.max(0, totalChecked - (sum.errorRows || 0));
          const healthScore = Math.round(parseFloat(sum.compliance) || 75);

          return {
            totalChecked,
            validCount,
            criticalErrors,
            warnings,
            healthScore
          };
        }
      }
    } catch {
      // Fallback
    }

    const errors = getStoredErrors();
    const unresolved = errors.filter(e => e.status === 'Unresolved');
    const criticalErrors = unresolved.filter(e => e.severity === 'Critical').length;
    const warnings = unresolved.filter(e => e.severity === 'Warning').length;

    const totalChecked = 150;
    const validCount = totalChecked - unresolved.length;
    const healthScore = Math.max(0, Math.round((validCount / totalChecked) * 100));

    return {
      totalChecked,
      validCount,
      criticalErrors,
      warnings,
      healthScore
    };
  },

  async resolveError(id: string): Promise<ValidationError> {
    try {
      const res = await apiFetch<{ success: boolean; data: ValidationError }>(`/audit/errors/${id}/resolve`, {
        method: 'PATCH'
      });
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const errors = getStoredErrors();
    const index = errors.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Validation error item not found');

    const updated: ValidationError = {
      ...errors[index],
      status: 'Resolved'
    };
    errors[index] = updated;
    saveStoredErrors(errors);
    return updated;
  },

  async ignoreError(id: string): Promise<ValidationError> {
    try {
      const res = await apiFetch<{ success: boolean; data: ValidationError }>(`/audit/errors/${id}/ignore`, {
        method: 'PATCH'
      });
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const errors = getStoredErrors();
    const index = errors.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Validation error item not found');

    const updated: ValidationError = {
      ...errors[index],
      status: 'Ignored'
    };
    errors[index] = updated;
    saveStoredErrors(errors);
    return updated;
  }
};
