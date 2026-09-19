import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard';
import { AccountsPage } from '../pages/Accounts';
import { ProductsPage } from '../pages/Products';
import { MappingsPage } from '../pages/Mappings';
import { ValidationPage } from '../pages/Validation';
import { ExcelImportPage } from '../pages/ExcelImport';
import { GoldSilverRatesPage } from '../pages/GoldSilverRates';
import { RateAndLedgerAuditPage } from '../pages/RateAndLedgerAudit';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RateAndLedgerAuditPage />} />
      <Route path="/rate-and-ledger-audit" element={<RateAndLedgerAuditPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/mappings" element={<MappingsPage />} />
      <Route path="/validation" element={<ValidationPage />} />
      <Route path="/import" element={<ExcelImportPage />} />
      <Route path="/rates" element={<GoldSilverRatesPage />} />
    </Routes>
  );
};
