import React, { useState } from 'react';
import { CheckCircle2, Save, FileSpreadsheet, Upload, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { importApi } from '../../services/importApi';
import type { RateImportPreviewResult } from '../../services/importApi';
import './GoldSilverRates.css';

export interface RateRuleRow {
  id: string;
  productName: string;
  minRate: number | string;
  maxRate: number | string;
}

const INITIAL_RULE_BOOK_RANGES: RateRuleRow[] = [
  { id: '14k', productName: 'Gold Ornaments 14K', minRate: 8740, maxRate: 10000 },
  { id: '18k', productName: 'Gold Ornaments 18K', minRate: 11800, maxRate: 12000 },
  { id: 'cust-18k', productName: 'Customer Gold Ornaments 18K', minRate: 11800, maxRate: 12000 },
  { id: 'cust-22k', productName: 'Customer Gold Ornaments 22K', minRate: 14500, maxRate: 15000 },
  { id: '22k', productName: 'Gold Ornaments 22K', minRate: 14500, maxRate: 15000 },
  { id: 'jadau', productName: 'Gold Ornaments Jadau', minRate: 14500, maxRate: 14999 },
  { id: '24k', productName: 'Standard Gold 24K', minRate: 16000, maxRate: 16800 },
  { id: 'silver', productName: 'Silver articles', minRate: 85, maxRate: 95 }
];

export const GoldSilverRatesPage: React.FC = () => {
  const [rows, setRows] = useState<RateRuleRow[]>(INITIAL_RULE_BOOK_RANGES);
  const [showSaveAlert, setShowSaveAlert] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Thursday, August 6, 2026 - 10:17:13 AM');

  // Excel Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<RateImportPreviewResult | null>(null);
  const [isImportProcessing, setIsImportProcessing] = useState(false);

  const handleMinChange = (id: string, val: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, minRate: val } : r));
  };

  const handleMaxChange = (id: string, val: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, maxRate: val } : r));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveAlert(true);
      const now = new Date();
      setLastSaved(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' - ' + now.toLocaleTimeString('en-US'));
    }, 400);
  };

  // Load Sample Excel Rate Sheet
  const handleLoadSampleExcel = async () => {
    setIsImportProcessing(true);
    try {
      const sampleRates = [
        { PRODUCT: 'Gold Ornaments 14K', MIN: 8800, MAX: 10200 },
        { PRODUCT: 'Gold Ornaments 18K', MIN: 11900, MAX: 12150 },
        { PRODUCT: 'Customer Gold Ornaments 18K', MIN: 11900, MAX: 12150 },
        { PRODUCT: 'Customer Gold Ornaments 22K', MIN: 14600, MAX: 15200 },
        { PRODUCT: 'Gold Ornaments 22K', MIN: 14600, MAX: 15200 },
        { PRODUCT: 'Gold Ornaments Jadau', MIN: 14600, MAX: 15100 },
        { PRODUCT: 'Standard Gold 24K', MIN: 16200, MAX: 17000 },
        { PRODUCT: 'Silver articles', MIN: 88, MAX: 98 }
      ];
      const result = await importApi.processRateImportData(sampleRates);
      setImportPreview(result);
    } finally {
      setIsImportProcessing(false);
    }
  };

  // File Change Upload Handler
  const handleRateFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsImportProcessing(true);
      try {
        const buffer = await file.arrayBuffer();
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rawJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Record<string, any>[];
        const result = await importApi.processRateImportData(rawJson);
        setImportPreview(result);
      } catch (err: any) {
        alert('Failed to parse Excel rate sheet: ' + err.message);
      } finally {
        setIsImportProcessing(false);
      }
    }
  };

  // Commit Imported Rates to Rule Book Ranges
  const handleCommitImportedRates = () => {
    if (!importPreview) return;
    const validImportedRows = importPreview.rows.filter(r => r._status === 'Valid');

    setRows(prevRows => {
      return prevRows.map(row => {
        const match = validImportedRows.find(imp =>
          imp.productName.toLowerCase() === row.productName.toLowerCase()
        );
        if (match) {
          return {
            ...row,
            minRate: match.minRate,
            maxRate: match.maxRate
          };
        }
        return row;
      });
    });

    setIsImportModalOpen(false);
    setImportPreview(null);
    setShowSaveAlert(true);
    const now = new Date();
    setLastSaved(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' - ' + now.toLocaleTimeString('en-US'));
  };

  const importColumns: Column<any>[] = [
    {
      key: '_status',
      header: 'Validation',
      render: r => (
        r._status === 'Valid' ? (
          <span className="badge badge-success">Valid</span>
        ) : (
          <span className="badge badge-danger">Error</span>
        )
      )
    },
    { key: 'productName', header: 'PRODUCT', render: r => <span className="font-semibold text-slate">{r.productName}</span> },
    { key: 'minRate', header: 'MIN RATE', render: r => <span className="font-mono text-emerald">{r.minRate}</span> },
    { key: 'maxRate', header: 'MAX RATE', render: r => <span className="font-mono text-indigo">{r.maxRate}</span> },
    { key: '_errorMsg', header: 'Notes', render: r => <span className="text-xs text-slate">{r._errorMsg || 'Ready'}</span> }
  ];

  return (
    <div className="scrutiny-rates-page">
      {/* Header Eyebrow & Title */}
      <div className="page-title-block">
        <span className="eyebrow-tag">SCRUTINY</span>
        <div className="flex-title-row">
          <h1 className="scrutiny-heading">Gold & Silver Rates</h1>
          <div className="header-action-group">
            <Button
              variant="secondary"
              icon={<FileSpreadsheet size={16} />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import Rates (Excel)
            </Button>
            <span className="last-saved-time">Last saved: {lastSaved}</span>
          </div>
        </div>
        <p className="scrutiny-subtext">
          Enter min and max unit rates for gold and silver products. Sales audit compares <strong>invoice unit rate</strong> only after -15% on min and +15% on max.
        </p>
      </div>

      {/* Success Alert Banner */}
      {showSaveAlert && (
        <div className="scrutiny-alert-banner">
          <CheckCircle2 size={18} className="alert-icon" />
          <span>Gold & silver rates saved. You can return to the audit and run validation.</span>
        </div>
      )}

      {/* Main Content Card: Rule Book Ranges */}
      <div className="rule-book-card">
        <div className="card-top-bar">
          <h2 className="card-section-title">Rule book ranges</h2>
          <Button variant="primary" icon={<Save size={16} />} loading={isSaving} onClick={handleSave}>
            Save Rates
          </Button>
        </div>

        <div className="rule-table-container">
          <table className="rule-table">
            <thead>
              <tr>
                <th className="th-product">PRODUCT</th>
                <th className="th-min">MIN</th>
                <th className="th-max">MAX</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td className="td-product-name">{row.productName}</td>
                  <td className="td-input">
                    <input
                      type="number"
                      className="rate-pill-input"
                      value={row.minRate}
                      onChange={e => handleMinChange(row.id, e.target.value)}
                    />
                  </td>
                  <td className="td-input">
                    <input
                      type="number"
                      className="rate-pill-input"
                      value={row.maxRate}
                      onChange={e => handleMaxChange(row.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Gold & Silver Rates Excel Sheet"
        footer={
          importPreview ? (
            <>
              <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<ArrowRight size={16} />}
                disabled={importPreview.validRows === 0}
                onClick={handleCommitImportedRates}
              >
                Apply Imported Rates ({importPreview.validRows} Items)
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Close
            </Button>
          )
        }
      >
        <div className="modal-import-container">
          <div className="import-modal-actions">
            <Button
              variant="glass"
              icon={<RefreshCw size={14} />}
              onClick={handleLoadSampleExcel}
              loading={isImportProcessing}
            >
              Load Sample Rate Excel Sheet
            </Button>
          </div>

          <div className="dropzone-card-sm">
            <input
              type="file"
              id="rate-excel-input"
              accept=".xlsx,.xls,.csv"
              className="hidden-file-input"
              onChange={handleRateFileChange}
            />
            <label htmlFor="rate-excel-input" className="dropzone-label-sm">
              <Upload size={24} className="text-emerald" />
              <span>Select or drag & drop Gold & Silver Excel Rate File (.xlsx, .csv)</span>
            </label>
          </div>

          {importPreview && (
            <div className="modal-preview-wrapper">
              <div className="preview-status-pill">
                Parsed {importPreview.totalRows} Rows | Valid: {importPreview.validRows} | Errors: {importPreview.errorRows}
              </div>
              <Table
                columns={importColumns}
                data={importPreview.rows}
                keyExtractor={(r: any) => r.productName + Math.random()}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
