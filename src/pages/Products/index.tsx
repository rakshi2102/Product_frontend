import React, { useState } from 'react';
import { Plus, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useAccounts } from '../../hooks/useAccounts';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { Modal } from '../../components/Modal';
import type { Product, ProductStatus } from '../../types/product';
import { formatCurrency, getStatusBadgeClass } from '../../utils/helpers';
import '../Accounts/Accounts.css';

export const ProductsPage: React.FC = () => {
  const { products, loading, filter, setFilter, createProduct } = useProducts();
  const { accounts } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Hardware',
    price: 0,
    cost: 0,
    taxRate: 0,
    unit: 'pcs',
    status: 'Active' as ProductStatus,
    mappedAccountId: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAccount = accounts.find(a => a.id === formData.mappedAccountId);
    await createProduct({
      ...formData,
      mappedAccountCode: selectedAccount?.code,
      mappedAccountName: selectedAccount?.name
    });
    setIsModalOpen(false);
    setFormData({
      sku: '',
      name: '',
      category: 'Hardware',
      price: 0,
      cost: 0,
      taxRate: 0,
      unit: 'pcs',
      status: 'Active',
      mappedAccountId: ''
    });
  };

  const columns: Column<Product>[] = [
    {
      key: 'sku',
      header: 'SKU Code',
      render: p => <span className="font-mono text-indigo">{p.sku}</span>
    },
    {
      key: 'name',
      header: 'Product Name',
      render: p => (
        <div>
          <div className="font-semibold text-white">{p.name}</div>
          <div className="text-xs text-slate">{p.unit}</div>
        </div>
      )
    },
    { key: 'category', header: 'Category' },
    {
      key: 'price',
      header: 'Selling Price',
      render: p => formatCurrency(p.price)
    },
    {
      key: 'cost',
      header: 'Unit Cost',
      render: p => formatCurrency(p.cost)
    },
    {
      key: 'mapping',
      header: 'Mapped GL Account',
      render: p => (
        p.mappedAccountCode ? (
          <div className="flex items-center gap-1 text-xs text-emerald">
            <CheckCircle size={14} />
            <span>{p.mappedAccountCode} - {p.mappedAccountName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-amber">
            <AlertCircle size={14} />
            <span>Unmapped</span>
          </div>
        )
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: p => <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
    }
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">Manage SKUs, pricing tiers, and General Ledger assignments.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          New Product SKU
        </Button>
      </div>

      {/* Filter Card */}
      <div className="filter-card">
        <div className="filter-item search">
          <Input
            placeholder="Search SKU code, name or category..."
            icon={<Search size={16} />}
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
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
        <div className="filter-item">
          <Select
            label="Mapping Filter"
            value={filter.mappingFilter}
            onChange={e => setFilter({ ...filter, mappingFilter: e.target.value as any })}
            options={[
              { value: 'All', label: 'All Mapping Statuses' },
              { value: 'Mapped', label: 'Mapped Products' },
              { value: 'Unmapped', label: 'Unmapped Products' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={products}
        keyExtractor={p => p.id}
        loading={loading}
        emptyText="No products matching filters"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product SKU"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save Product
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="modal-form-grid">
          <Input
            label="SKU Code"
            placeholder="e.g. HW-100-XYZ"
            required
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
          />
          <Input
            label="Product Name"
            placeholder="e.g. VMC Optical Sensor"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Hardware', label: 'Hardware' },
              { value: 'Software', label: 'Software' },
              { value: 'Services', label: 'Services' },
              { value: 'Accessories', label: 'Accessories' }
            ]}
          />
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Unit Cost ($)"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />
          <Select
            label="GL Revenue Account"
            value={formData.mappedAccountId}
            onChange={e => setFormData({ ...formData, mappedAccountId: e.target.value })}
            options={[
              { value: '', label: '— Select GL Account —' },
              ...accounts.map(a => ({
                value: a.id,
                label: `${a.code} - ${a.name} (${a.type})`
              }))
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
