import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { importApi } from '../../services/importApi';
import type { ImportPreviewResult } from '../../services/importApi';
import { productApi } from '../../services/productApi';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { formatCurrency } from '../../utils/helpers';
import '../Accounts/Accounts.css';
import './ExcelImport.css';

export const ExcelImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewResult, setPreviewResult] = useState<ImportPreviewResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  const handleSampleLoad = async () => {
    setIsProcessing(true);
    setImportSuccessMsg(null);
    try {
      const sampleRawData = [
        { SKU: 'HW-MOD-900', Name: '5G Telemetry Edge Module', Category: 'Hardware', Price: 1450.00, Cost: 620.00, 'Account Code': '4001' },
        { SKU: 'SW-ANL-100', Name: 'Predictive Diagnostics Add-on', Category: 'Software', Price: 1200.00, Cost: 50.00, 'Account Code': '4002' },
        { SKU: 'SV-CAL-002', Name: 'Annual Maintenance Service Pack', Category: 'Services', Price: 950.00, Cost: 400.00, 'Account Code': '4003' },
        { SKU: 'ERR-INVALID', Name: '', Category: 'Accessories', Price: -50.00, Cost: 10.00, 'Account Code': '' }
      ];
      const result = await importApi.processImportData(sampleRawData);
      setPreviewResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setIsProcessing(true);
      setImportSuccessMsg(null);
      try {
        const buffer = await uploadedFile.arrayBuffer();
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rawJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Record<string, any>[];
        const result = await importApi.processImportData(rawJson);
        setPreviewResult(result);
      } catch (err: any) {
        alert('Failed to parse Excel file: ' + err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCommitImport = async () => {
    if (!previewResult) return;
    setIsProcessing(true);
    try {
      const validRows = previewResult.rows.filter(r => r._status === 'Valid');
      for (const row of validRows) {
        await productApi.createProduct({
          sku: row.sku,
          name: row.name,
          category: row.category,
          price: row.price,
          cost: row.cost,
          taxRate: 8.5,
          unit: 'pcs',
          status: 'Active',
          mappedAccountCode: row.accountCode || undefined
        });
      }
      setImportSuccessMsg(`Successfully imported ${validRows.length} catalog items into the system!`);
      setPreviewResult(null);
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: Column<any>[] = [
    {
      key: '_status',
      header: 'Validation',
      render: r => (
        r._status === 'Valid' ? (
          <span className="badge badge-success"><CheckCircle2 size={13} /> Valid</span>
        ) : (
          <span className="badge badge-danger"><AlertTriangle size={13} /> Error</span>
        )
      )
    },
    { key: 'sku', header: 'SKU', render: r => <span className="font-mono text-indigo">{r.sku}</span> },
    { key: 'name', header: 'Product Name', render: r => <span className="text-white">{r.name || '—'}</span> },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price', render: r => formatCurrency(r.price) },
    { key: 'cost', header: 'Cost', render: r => formatCurrency(r.cost) },
    { key: 'accountCode', header: 'GL Account Code', render: r => r.accountCode || 'Unmapped' },
    {
      key: '_errorMsg',
      header: 'Notes',
      render: r => <span className="text-xs text-slate">{r._errorMsg || 'Ready for import'}</span>
    }
  ];

  return (
    <div className="excel-import-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Excel Data Import Engine</h1>
          <p className="page-subtitle">Batch import product catalogs and General Ledger mapping files (.xlsx, .csv).</p>
        </div>
        <Button variant="secondary" icon={<RefreshCw size={16} />} onClick={handleSampleLoad}>
          Load Sample Excel Dataset
        </Button>
      </div>

      {importSuccessMsg && (
        <div className="import-alert success">
          <CheckCircle2 size={20} />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div className="dropzone-card">
        <input
          type="file"
          id="excel-file-input"
          accept=".xlsx,.xls,.csv"
          className="hidden-file-input"
          onChange={handleFileChange}
        />
        <label htmlFor="excel-file-input" className="dropzone-label">
          <div className="dropzone-icon">
            <Upload size={32} />
          </div>
          <div className="dropzone-text">
            <span className="dropzone-title">
              {file ? file.name : 'Click to select or drag & drop Excel file'}
            </span>
            <span className="dropzone-sub">Supports .xlsx, .xls, .csv files up to 25MB</span>
          </div>
        </label>
      </div>

      {/* Preview Section */}
      {previewResult && (
        <div className="preview-container">
          <div className="preview-header">
            <div>
              <h3>Import Data Dry-Run Preview</h3>
              <p className="text-xs text-slate">
                Total Rows: {previewResult.totalRows} | Valid: {previewResult.validRows} | Errors: {previewResult.errorRows}
              </p>
            </div>
            <Button
              variant="primary"
              icon={<ArrowRight size={16} />}
              loading={isProcessing}
              disabled={previewResult.validRows === 0}
              onClick={handleCommitImport}
            >
              Commit ({previewResult.validRows} Records)
            </Button>
          </div>

          <Table
            columns={columns}
            data={previewResult.rows}
            keyExtractor={r => r.sku + Math.random()}
            loading={isProcessing}
          />
        </div>
      )}
    </div>
  );
};
