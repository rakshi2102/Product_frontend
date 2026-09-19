import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFilter } from '../types/product';
import { productApi } from '../services/productApi';

export function useProducts(initialFilter?: ProductFilter) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>(initialFilter || {
    search: '',
    category: 'All',
    status: 'All',
    mappingFilter: 'All'
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts(filter);
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await productApi.createProduct(productData);
    await fetchProducts();
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await productApi.updateProduct(id, updates);
    await fetchProducts();
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await productApi.deleteProduct(id);
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    filter,
    setFilter,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
