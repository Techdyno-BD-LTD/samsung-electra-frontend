"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiShoppingBag, FiLoader, FiX } from "react-icons/fi";
import Skeleton from "@/components/common/Skeleton";

export const forceDynamic = "force-dynamic";

interface ExchangeProduct {
  id: number;
  name: string;
  image: string;
  description: string;
}

const ExchangeProductPage = () => {
  const [products, setProducts] = useState<ExchangeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ExchangeProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/v2/exchange-products");
        const payload = await response.json();
        if (payload.success) {
          setProducts(payload.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch exchange products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-8 border-slate-100">
          <h2 className="text-xl lg:text-xl font-semibold text-slate-800 mb-6">Select below what you want to exchange.</h2>
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-between group cursor-pointer transition-all hover:shadow-md hover:bg-white hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 text-center">
                    {product.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p>No exchange products found.</p>
            </div>
          )}
        </div>

        {/* Empty State / Application Section */}
        <div className="p-12 lg:p-20 border-t border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-6">
            <Image
              src="/images/shop.png"
              alt="Empty Exchange"
              width={128}
              height={128}
              className="opacity-20 translate-y-2 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiShoppingBag className="text-6xl text-blue-100" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-slate-200 rounded-full flex items-center justify-center bg-white">
                <span className="text-2xl font-bold text-slate-300">×</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 mb-8 font-medium">
             You have not listed any exchange item.
          </p>
          <button className="bg-[#2b7fe8] text-white px-10 py-3.5 rounded-full font-bold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5 shadow-md">
             Apply for Exchange product
          </button>
        </div>
      </div>

      {/* Modal for Detailed Description */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-xl font-bold text-slate-800">{selectedProduct.name}</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 shadow-sm"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-50 border border-slate-100 p-8">
                 <Image 
                   src={selectedProduct.image || "/images/placeholder.png"} 
                   fill 
                   className="object-contain p-4" 
                   alt={selectedProduct.name} 
                 />
              </div>
              <div className="rich-text-content">
                 <div dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeProductPage;
