import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import type { Account, AccountType } from '../../types/account';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';
import './Accounts.css';

export const AccountsPage: React.FC = () => {
  const { accounts, loading, filter, setFilter, createAccount } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Revenue' as AccountType,
    category: 'Sales',
    balance: 0,
    currency: 'USD',
    status: 'Active' as const,
    description: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount(formData);
    setIsModalOpen(false);
    setFormData({
      code: '',
      name: '',
      type: 'Revenue',
      category: 'Sales',
      balance: 0,
      currency: 'USD',
      status: 'Active',
      description: ''
    });
  };

  const columns: Column<Account>[] = [
    {
      key: 'code',
      header: 'GL Code',
      render: acc => <span className="font-mono text-indigo">{acc.code}</span>
    },
    {
      key: 'name',
      header: 'Account Name',
      render: acc => (
        <div>
          <div className="font-semibold text-white">{acc.name}</div>
          {acc.description && <div className="text-xs text-slate">{acc.description}</div>}
        </div>
      )
    },
    { key: 'type', header: 'Account Type' },
    { key: 'category', header: 'Category' },
    {
      key: 'balance',
      header: 'Ledger Balance',
      render: acc => (
        <span className="font-semibold">
          {formatCurrency(acc.balance, acc.currency)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: acc => (
        <span className={getStatusBadgeClass(acc.status)}>{acc.status}</span>
      )
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: acc => formatDate(acc.updatedAt)
    }
  ];

  return (
    <div className="accounts-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Chart of Accounts</h1>
          <p className="page-subtitle">General Ledger account structure and currency balances.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add New GL Account
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="filter-card">
        <div className="filter-item search">
          <Input
            placeholder="Search account code, name or category..."
            icon={<Search size={16} />}
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
        <div className="filter-item">
          <Select
            label="Type"
            value={filter.type}
            onChange={e => setFilter({ ...filter, type: e.target.value })}
            options={[
              { value: 'All', label: 'All Account Types' },
              { value: 'Asset', label: 'Asset' },
              { value: 'Liability', label: 'Liability' },
              { value: 'Equity', label: 'Equity' },
              { value: 'Revenue', label: 'Revenue' },
              { value: 'Expense', label: 'Expense' }
            ]}
          />
        </div>
        <div className="filter-item">
          <Select
            label="Status"
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={accounts}
        keyExtractor={acc => acc.id}
        loading={loading}
        emptyText="No GL accounts matching your filters"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create GL Account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="modal-form-grid">
          <Input
            label="GL Account Code"
            placeholder="e.g. 4005"
            required
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value })}
          />
          <Input
            label="Account Name"
            placeholder="e.g. Consulting Revenue"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Type"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as AccountType })}
            options={[
              { value: 'Revenue', label: 'Revenue' },
              { value: 'Expense', label: 'Expense' },
              { value: 'Asset', label: 'Asset' },
              { value: 'Liability', label: 'Liability' },
              { value: 'Equity', label: 'Equity' }
            ]}
          />
          <Input
            label="Category"
            placeholder="e.g. Sales, COGS, Operating"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            label="Initial Balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={e => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Description"
            placeholder="Brief account purpose..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};
