import type { Product, ProductFilter } from '../types/product';
import { INITIAL_PRODUCTS } from '../utils/constants';
import { apiFetch } from './apiClient';

const STORAGE_KEY = 'v_products_data_v1';

function getStoredProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveStoredProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const productApi = {
  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filter?.search) queryParams.append('search', filter.search);
      if (filter?.category && filter.category !== 'All') queryParams.append('category', filter.category);
      if (filter?.status && filter.status !== 'All') queryParams.append('status', filter.status);

      const res = await apiFetch<{ success: boolean; data: Product[] }>(`/products?${queryParams.toString()}`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback to local storage
    }

    let products = getStoredProducts();
    if (!filter) return products;

    return products.filter(p => {
      const matchesSearch = !filter.search ||
        p.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        p.sku.toLowerCase().includes(filter.search.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.search.toLowerCase());

      const matchesCategory = !filter.category || filter.category === 'All' || p.category === filter.category;
      const matchesStatus = !filter.status || filter.status === 'All' || p.status === filter.status;
      
      let matchesMapping = true;
      if (filter.mappingFilter === 'Mapped') {
        matchesMapping = !!p.mappedAccountId;
      } else if (filter.mappingFilter === 'Unmapped') {
        matchesMapping = !p.mappedAccountId;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesMapping;
    });
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const res = await apiFetch<{ success: boolean; data: Product }>('/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const products = getStoredProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveStoredProducts(products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updated = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    products[index] = updated;
    saveStoredProducts(products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = getStoredProducts().filter(p => p.id !== id);
    saveStoredProducts(products);
  }
};
