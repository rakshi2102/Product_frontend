import React, { useEffect, useState } from 'react';
import { 
  Package, 
  BookOpen, 
  ArrowLeftRight, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/helpers';
import { accountApi } from '../../services/accountApi';
import { productApi } from '../../services/productApi';
import { mappingApi } from '../../services/mappingApi';
import { validationApi } from '../../services/validationApi';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalProducts: 0,
    mappedProducts: 0,
    unmappedProducts: 0,
    healthScore: 100,
    criticalErrors: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    async function loadData() {
      const accounts = await accountApi.getAccounts();
      const products = await productApi.getProducts();
      const mappings = await mappingApi.getMappings();
      const valSummary = await validationApi.getSummary();

      const mappedCount = mappings.filter(m => m.status === 'Mapped').length;
      const unmappedCount = mappings.filter(m => m.status === 'Unmapped').length;
      const totalRev = accounts
        .filter(a => a.type === 'Revenue')
        .reduce((sum, a) => sum + a.balance, 0);

      setStats({
        totalAccounts: accounts.length,
        totalProducts: products.length,
        mappedProducts: mappedCount,
        unmappedProducts: unmappedCount,
        healthScore: valSummary.healthScore,
        criticalErrors: valSummary.criticalErrors,
        totalRevenue: totalRev
      });
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Real-time ledger overview, mapping status & data integrity health.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/import">
            <Button variant="primary" icon={<FileSpreadsheet size={16} />}>
              Import Excel Data
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box indigo">
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Catalog Products</span>
            <span className="kpi-value">{stats.totalProducts}</span>
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> +12% this month
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box emerald">
            <BookOpen size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">GL Accounts</span>
            <span className="kpi-value">{stats.totalAccounts}</span>
            <span className="kpi-subtext">Revenue: {formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box cyan">
            <ArrowLeftRight size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Mapped Coverage</span>
            <span className="kpi-value">
              {stats.totalProducts > 0 
                ? `${Math.round((stats.mappedProducts / stats.totalProducts) * 100)}%` 
                : '100%'}
            </span>
            <span className="kpi-subtext">
              {stats.mappedProducts} Mapped / {stats.unmappedProducts} Unmapped
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box amber">
            <ShieldAlert size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ledger Integrity Score</span>
            <span className="kpi-value">{stats.healthScore}%</span>
            <span className="kpi-subtext warning">
              {stats.criticalErrors} Actionable Items
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="quick-grid">
        <div className="quick-card">
          <div className="card-header">
            <h3>Mapping Automation</h3>
            <span className="status-badge success">Engine Active</span>
          </div>
          <p className="card-desc">
            Automatically resolve product SKU to General Ledger account codes based on catalog rule definitions.
          </p>
          <div className="card-footer">
            <Link to="/mappings">
              <Button variant="glass" icon={<ArrowRight size={16} />}>
                Go to Mapping Studio
              </Button>
            </Link>
          </div>
        </div>

        <div className="quick-card">
          <div className="card-header">
            <h3>Data Validation</h3>
            {stats.criticalErrors > 0 ? (
              <span className="status-badge danger">
                <AlertTriangle size={13} /> {stats.criticalErrors} Anomaly
              </span>
            ) : (
              <span className="status-badge success">
                <CheckCircle2 size={13} /> Clear
              </span>
            )}
          </div>
          <p className="card-desc">
            Continuous validation checks for missing tax rates, unmapped active products, and ledger inconsistencies.
          </p>
          <div className="card-footer">
            <Link to="/validation">
              <Button variant="secondary" icon={<ArrowRight size={16} />}>
                Review Anomalies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
