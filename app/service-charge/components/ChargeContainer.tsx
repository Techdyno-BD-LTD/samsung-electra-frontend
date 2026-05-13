'use client';

import React, { useState, useMemo } from 'react';
import ChargeFilters from "./ChargeFilters";
import ChargeTable from "./ChargeTable";

interface ChargeRow {
  product: string;
  brand: string;
  category: string;
  inspection: string;
  service: string;
}

interface ChargeContainerProps {
  initialRows: ChargeRow[];
  searchPlaceholder?: string;
}

const ChargeContainer: React.FC<ChargeContainerProps> = ({ initialRows, searchPlaceholder }) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Extract unique products and brands from the data
  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(initialRows.map(r => r.product).filter(Boolean))).sort();
  }, [initialRows]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(initialRows.map(r => r.brand).filter(Boolean))).sort();
  }, [initialRows]);

  // Filter rows based on state
  const filteredRows = useMemo(() => {
    return initialRows.filter(row => {
      const matchesSearch = !search || 
        row.product.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.category.toLowerCase().includes(search.toLowerCase());
      
      const matchesProduct = !selectedProduct || row.product === selectedProduct;
      const matchesBrand = !selectedBrand || row.brand === selectedBrand;

      return matchesSearch && matchesProduct && matchesBrand;
    });
  }, [initialRows, search, selectedProduct, selectedBrand]);

  return (
    <div className="space-y-8">
      <ChargeFilters 
        placeholder={searchPlaceholder}
        products={uniqueProducts}
        brands={uniqueBrands}
        search={search}
        onSearchChange={setSearch}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
      />
      <ChargeTable rows={filteredRows} />
    </div>
  );
};

export default ChargeContainer;
