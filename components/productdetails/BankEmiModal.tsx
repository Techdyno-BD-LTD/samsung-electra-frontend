"use client";

import { useState, useMemo, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import Skeleton from "@/components/common/Skeleton";

interface EmiPlan {
  months?: number;
  interest_rate?: number;
  product_price?: number;
  effective_price?: number;
  monthly_payable?: number;
}

interface BankEmiPlan {
  bank_id?: number;
  bank_name?: string;
  max_month?: number;
  plans?: EmiPlan[];
}

interface BankEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  emiPlans?: BankEmiPlan[];
  productName: string;
  productSlug?: string;
}

export default function BankEmiModal({
  isOpen,
  onClose,
  emiPlans: initialEmiPlans,
  productName: initialProductName,
  productSlug,
}: BankEmiModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<number | "none">("none");
  const [fetchedEmiPlans, setFetchedEmiPlans] = useState<BankEmiPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emiPlans = initialEmiPlans?.length ? initialEmiPlans : (fetchedEmiPlans || []);

  useEffect(() => {
    if (isOpen && (!initialEmiPlans || initialEmiPlans.length === 0) && productSlug) {
      const fetchPlans = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/products/${productSlug}`);
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setFetchedEmiPlans(data.data[0].emi_plans || []);
          }
        } catch (error) {
          console.error("Failed to fetch EMI plans:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlans();
    }
  }, [isOpen, initialEmiPlans, productSlug]);

  const filteredBanks = useMemo(() => {
    return emiPlans.filter((bank) =>
      bank.bank_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [emiPlans, searchTerm]);

  const selectedBank = useMemo(() => {
    if (selectedBankId === "none") return null;
    return emiPlans.find((bank) => bank.bank_id === selectedBankId);
  }, [emiPlans, selectedBankId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[1000px] h-fit lg:h-[600px] max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-800">Bank EMI</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Sidebar (Top on Mobile) */}
          <div className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col bg-white lg:bg-slate-50/30 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Bank"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-sm focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[200px] lg:max-h-full">
              <button
                onClick={() => setSelectedBankId("none")}
                className={`w-full text-left px-6 py-3 text-sm transition-all border-b border-slate-50 ${
                  selectedBankId === "none"
                    ? "bg-[#0A3D62] text-white font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                None
              </button>
              {filteredBanks.map((bank) => (
                <button
                  key={bank.bank_id}
                  onClick={() => setSelectedBankId(bank.bank_id || 0)}
                  className={`w-full text-left px-6 py-3 text-sm transition-all border-b border-slate-50 ${
                    selectedBankId === bank.bank_id
                      ? "bg-[#0A3D62] text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {bank.bank_name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content (Below on Mobile) */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto lg:overflow-hidden p-4 lg:p-6 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center py-10 w-full">
                <div className="flex flex-col items-center gap-4 w-full px-12">
                  <Skeleton className="h-10 w-1/2 rounded-xl" />
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <p className="text-sm font-medium text-slate-500">Loading EMI Plans...</p>
                </div>
              </div>
            ) : selectedBank ? (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {selectedBank.bank_name}
                </h3>
                <div className="flex-1 overflow-x-auto lg:overflow-y-auto border border-slate-100 rounded-xl shadow-sm custom-scrollbar">
                  <table className="w-full min-w-[600px] text-sm text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-4 font-bold text-slate-700 border-b border-r border-slate-100">Months</th>
                        <th className="px-4 py-4 font-bold text-slate-700 border-b border-r border-slate-100">EMI Charge(%)</th>
                        <th className="px-4 py-4 font-bold text-slate-700 border-b border-r border-slate-100">Product Price</th>
                        <th className="px-4 py-4 font-bold text-slate-700 border-b border-r border-slate-100">Effective Price</th>
                        <th className="px-4 py-4 font-bold text-slate-700 border-b">Monthly Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedBank.plans?.map((plan, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-slate-600 border-r border-slate-50">{plan.months?.toString().padStart(2, '0')} M</td>
                          <td className="px-4 py-4 text-slate-600 border-r border-slate-50">{plan.interest_rate}%</td>
                          <td className="px-4 py-4 text-slate-600 border-r border-slate-50">৳{plan.product_price?.toLocaleString()}</td>
                          <td className="px-4 py-4 text-slate-600 border-r border-slate-50">৳{plan.effective_price?.toLocaleString()}</td>
                          <td className="px-4 py-4 font-bold text-slate-900">৳{plan.monthly_payable?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-start justify-start text-slate-400 space-y-4">
                <p className="text-sm font-medium text-slate-600">Please Select a credit card</p>
                <div className="w-full border border-slate-100 rounded-xl bg-white flex flex-col overflow-hidden shadow-sm overflow-x-auto custom-scrollbar">
                  <div className="grid grid-cols-5 min-w-[600px] border-b border-slate-100 bg-slate-50">
                    {["Months", "EMI Charge(%)", "Product Price", "Effective Price", "Monthly Payable"].map((col) => (
                      <div key={col} className="px-4 py-4 text-xs font-bold text-slate-700 text-center flex items-center justify-center border-r last:border-r-0 border-slate-200">
                        {col}
                      </div>
                    ))}
                  </div>
                  <div className="h-[300px] min-w-[600px] flex items-center justify-center bg-white">
                    <p className="text-sm italic text-slate-300">Select a bank from the sidebar to view details</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
