import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, Search } from 'lucide-react';
import { useMappings } from '../../hooks/useMappings';
import { useAccounts } from '../../hooks/useAccounts';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import type { AccountMappingItem } from '../../types/mapping';
import { formatCurrency, getStatusBadgeClass } from '../../utils/helpers';
import '../Accounts/Accounts.css';

export const MappingsPage: React.FC = () => {
  const { mappings, rules, loading, filter, setFilter, updateMapping, runAutoMapping } = useMappings();
  const { accounts } = useAccounts();
  const [autoMappingLoading, setAutoMappingLoading] = useState(false);

  const handleAccountSelect = async (mappingItem: AccountMappingItem, accountId: string) => {
    const selected = accounts.find(a => a.id === accountId);
    if (selected) {
      await updateMapping(mappingItem.id, selected.id, selected.code, selected.name, selected.type);
    } else {
      await updateMapping(mappingItem.id, '', 'UNMAPPED', 'Unassigned Account', 'None');
    }
  };

  const handleRunAuto = async () => {
    setAutoMappingLoading(true);
    try {
      await runAutoMapping();
    } finally {
      setAutoMappingLoading(false);
    }
  };

  const columns: Column<AccountMappingItem>[] = [
    {
      key: 'productSku',
      header: 'Product SKU',
      render: item => <span className="font-mono text-indigo">{item.productSku}</span>
    },
    {
      key: 'productName',
      header: 'Product Name',
      render: item => (
        <div>
          <div className="font-semibold text-white">{item.productName}</div>
          <div className="text-xs text-slate">{item.productCategory} • {formatCurrency(item.price)}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Mapping Status',
      render: item => <span className={getStatusBadgeClass(item.status)}>{item.status}</span>
    },
    {
      key: 'confidence',
      header: 'Match Source',
      render: item => (
        <span className="text-xs text-slate">
          {item.ruleName ? (
            <span className="flex items-center gap-1 text-emerald">
              <Sparkles size={13} /> {item.ruleName}
            </span>
          ) : (
            item.confidence
          )}
        </span>
      )
    },
    {
      key: 'accountSelection',
      header: 'Assigned GL Account',
      render: item => (
        <Select
          value={item.accountId}
          onChange={e => handleAccountSelect(item, e.target.value)}
          options={[
            { value: '', label: '— Unmapped —' },
            ...accounts.map(acc => ({
              value: acc.id,
              label: `${acc.code} - ${acc.name} (${acc.type})`
            }))
          ]}
        />
      )
    }
  ];

  return (
    <div className="mappings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Account → Product Mapping Studio</h1>
          <p className="page-subtitle">Configure SKU to GL revenue rule relationships and execute automated matching.</p>
        </div>
        <Button
          variant="primary"
          icon={<Sparkles size={16} />}
          loading={autoMappingLoading}
          onClick={handleRunAuto}
        >
          Run Auto-Mapping Engine
        </Button>
      </div>

      {/* Rules Banner */}
      <div className="rules-banner">
        <div className="banner-title">
          <ArrowLeftRight size={18} />
          <span>Active Rules ({rules.length})</span>
        </div>
        <div className="rules-pills">
          {rules.map(rule => (
            <div key={rule.id} className="rule-pill">
              <span className="rule-cat">{rule.productCategory}</span>
              <span>→</span>
              <span className="rule-code">{rule.targetAccountCode} ({rule.targetAccountName})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Card */}
      <div className="filter-card">
        <div className="filter-item search">
          <Input
            placeholder="Search product SKU, account name, or code..."
            icon={<Search size={16} />}
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <Select
            label="Mapping Status"
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Mapped', label: 'Mapped' },
              { value: 'Unmapped', label: 'Unmapped' }
            ]}
          />
        </div>
        <div className="filter-item">
          <Select
            label="Category"
            value={filter.category}
            onChange={e => setFilter({ ...filter, category: e.target.value })}
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'Hardware', label: 'Hardware' },
              { value: 'Software', label: 'Software' },
              { value: 'Services', label: 'Services' },
              { value: 'Accessories', label: 'Accessories' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={mappings}
        keyExtractor={item => item.id}
        loading={loading}
        emptyText="No mappings found"
      />
    </div>
  );
};
