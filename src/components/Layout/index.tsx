import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Scale,
  FileText,
  FileCheck2,
  Package,
  BookOpen,
  RotateCcw,
  ShoppingCart,
  Calculator,
  Wallet,
  Building2,
  Coins,
  Gem,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  Sun,
  User,
  FileSpreadsheet
} from 'lucide-react';
import { Input } from '../Input';
import './Layout.css';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrutinyOpen, setScrutinyOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [tdsOpen, setTdsOpen] = useState(false);
  const location = useLocation();

  const isRateAndLedgerActive = location.pathname === '/' || location.pathname === '/rate-and-ledger-audit';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge-audit">
            <Scale size={18} />
          </div>
          <div className="logo-text-block">
            <span className="logo-code-text">HAA</span>
            <span className="logo-text-audit">ENTERPRISE AUDIT SUITE</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutGrid size={18} />
            <span>Dashboard</span>
          </NavLink>

          {/* Scrutiny Accordion Group */}
          <div className="nav-group">
            <button
              className={`nav-group-header ${scrutinyOpen ? 'open' : ''}`}
              onClick={() => setScrutinyOpen(!scrutinyOpen)}
            >
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-emerald-icon" />
                <span>Scrutiny</span>
              </div>
              {scrutinyOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {scrutinyOpen && (
              <div className="nav-group-body">
                {/* Sales Sub-accordion */}
                <div className="nav-subgroup">
                  <button
                    className={`nav-subgroup-header ${salesOpen ? 'open' : ''}`}
                    onClick={() => setSalesOpen(!salesOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>Sales</span>
                    </div>
                    {salesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {salesOpen && (
                    <div className="nav-subgroup-body">
                      <NavLink
                        to="/products"
                        className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      >
                        <FileCheck2 size={15} />
                        <span>ID Proof Audit</span>
                      </NavLink>
                      <NavLink
                        to="/mappings"
                        className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      >
                        <Package size={15} />
                        <span>Gross Weight Audit</span>
                      </NavLink>
                      <NavLink
                        to="/rate-and-ledger-audit"
                        className={`nav-subitem ${isRateAndLedgerActive ? 'active' : ''}`}
                      >
                        <BookOpen size={15} />
                        <span>Rate and Ledger Audit</span>
                      </NavLink>
                      <NavLink
                        to="/validation"
                        className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      >
                        <RotateCcw size={15} />
                        <span>Sales Return Audit</span>
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Purchase Sub-accordion */}
                <div className="nav-subgroup">
                  <button
                    className="nav-subgroup-header"
                    onClick={() => setPurchaseOpen(!purchaseOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} />
                      <span>Purchase</span>
                    </div>
                    {purchaseOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {purchaseOpen && (
                    <div className="nav-subgroup-body">
                      <NavLink to="/import" className="nav-subitem">
                        <FileSpreadsheet size={15} />
                        <span>Purchase Ledger Import</span>
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* TDS Audit */}
                <div className="nav-subgroup">
                  <button
                    className="nav-subgroup-header"
                    onClick={() => setTdsOpen(!tdsOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <Calculator size={16} />
                      <span>TDS Audit</span>
                    </div>
                    {tdsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>

                {/* Cash */}
                <NavLink to="/accounts" className="nav-subitem-flat">
                  <Wallet size={16} />
                  <span>Cash</span>
                </NavLink>

                {/* Negative Bank */}
                <NavLink to="/validation" className="nav-subitem-flat">
                  <Building2 size={16} />
                  <span>Negative Bank</span>
                </NavLink>

                {/* Section 44AB */}
                <NavLink to="/mappings" className="nav-subitem-flat">
                  <Calculator size={16} />
                  <span>Section 44AB</span>
                </NavLink>

                {/* Gold & Silver Rates */}
                <NavLink
                  to="/rates"
                  className={({ isActive }) => `nav-subitem-flat ${isActive ? 'active' : ''}`}
                >
                  <Coins size={16} />
                  <span>Gold & Silver Rates</span>
                </NavLink>

                {/* Rate Master */}
                <NavLink
                  to="/rates"
                  className={({ isActive }) => `nav-subitem-flat ${isActive ? 'active' : ''}`}
                >
                  <Gem size={16} />
                  <span>Rate Master</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar-audit">AU</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">admin@audit.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="app-main">
        <header className="top-header-light">
          <div className="header-left">
            <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="header-search">
              <Input
                placeholder="Search audit ledger, product SKU, account code..."
                icon={<Search size={16} />}
              />
            </div>
          </div>

          <div className="header-right">
            <button className="theme-toggle-btn" title="Toggle Theme">
              <Sun size={18} />
            </button>
            <button className="icon-btn-light" title="Audit Alerts">
              <Bell size={18} />
              <span className="badge-dot-green">27</span>
            </button>
            <div className="user-operator-pill">
              <div className="user-op-avatar">
                <User size={15} />
              </div>
              <span className="user-op-name">Audit operator</span>
            </div>
          </div>
        </header>

        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};
