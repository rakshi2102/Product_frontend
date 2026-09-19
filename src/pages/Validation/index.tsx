import React, { useEffect, useState } from 'react';
import { Check, EyeOff } from 'lucide-react';
import { validationApi } from '../../services/validationApi';
import type { ValidationError, ValidationSummary } from '../../types/validation';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { Button } from '../../components/Button';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import '../Accounts/Accounts.css';
import './Validation.css';

export const ValidationPage: React.FC = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [summary, setSummary] = useState<ValidationSummary>({
    totalChecked: 0,
    validCount: 0,
    criticalErrors: 0,
    warnings: 0,
    healthScore: 100
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const errList = await validationApi.getValidationErrors();
      const sum = await validationApi.getSummary();
      setErrors(errList);
      setSummary(sum);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async (id: string) => {
    await validationApi.resolveError(id);
    await loadData();
  };

  const handleIgnore = async (id: string) => {
    await validationApi.ignoreError(id);
    await loadData();
  };

  const columns: Column<ValidationError>[] = [
    {
      key: 'severity',
      header: 'Severity',
      render: err => {
        let badgeClass = 'badge badge-neutral';
        if (err.severity === 'Critical') badgeClass = 'badge badge-danger';
        if (err.severity === 'Warning') badgeClass = 'badge badge-warning';
        return <span className={badgeClass}>{err.severity}</span>;
      }
    },
    { key: 'ruleName', header: 'Validation Rule' },
    {
      key: 'entityReference',
      header: 'Entity Ref',
      render: err => <span className="font-mono text-indigo">{err.entityReference}</span>
    },
    {
      key: 'message',
      header: 'Issue Description',
      render: err => (
        <div>
          <div className="text-white">{err.message}</div>
          {err.suggestion && <div className="text-xs text-slate mt-1">💡 {err.suggestion}</div>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: err => <span className={getStatusBadgeClass(err.status)}>{err.status}</span>
    },
    {
      key: 'detectedAt',
      header: 'Detected At',
      render: err => formatDate(err.detectedAt)
    },
    {
      key: 'actions',
      header: 'Resolution Actions',
      render: err => (
        err.status === 'Unresolved' ? (
          <div className="flex gap-2">
            <Button size="sm" variant="glass" icon={<Check size={14} />} onClick={() => handleResolve(err.id)}>
              Resolve
            </Button>
            <Button size="sm" variant="ghost" icon={<EyeOff size={14} />} onClick={() => handleIgnore(err.id)}>
              Ignore
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate">No action required</span>
        )
      )
    }
  ];

  return (
    <div className="validation-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ledger Integrity & Mapping Validation</h1>
          <p className="page-subtitle">Automated anomaly detection, unmapped active products, and tax rate compliance.</p>
        </div>
        <Button variant="secondary" onClick={loadData}>
          Re-run Diagnostics
        </Button>
      </div>

      {/* Summary Scorecard */}
      <div className="val-summary-grid">
        <div className="val-card">
          <span className="val-label">Health Index</span>
          <span className="val-score">{summary.healthScore}%</span>
          <span className="val-sub">
            {summary.validCount} / {summary.totalChecked} Passed Integrity Tests
          </span>
        </div>

        <div className="val-card">
          <span className="val-label">Critical Anomaly</span>
          <span className="val-score danger">{summary.criticalErrors}</span>
          <span className="val-sub">Requires immediate ledger attention</span>
        </div>

        <div className="val-card">
          <span className="val-label">Warnings & Hints</span>
          <span className="val-score warning">{summary.warnings}</span>
          <span className="val-sub">Informational review items</span>
        </div>
      </div>

      {/* Error Table */}
      <Table
        columns={columns}
        data={errors}
        keyExtractor={err => err.id}
        loading={loading}
        emptyText="All validation integrity rules are 100% compliant!"
      />
    </div>
  );
};
