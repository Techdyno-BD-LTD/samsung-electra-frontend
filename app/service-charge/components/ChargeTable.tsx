import React from 'react';

interface ChargeRow {
  product: string;
  brand: string;
  category: string;
  inspection: string;
  service: string;
}

interface ChargeTableProps {
  rows: ChargeRow[];
}

const ChargeTable: React.FC<ChargeTableProps> = ({ rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#fcfcfc] border-b border-slate-200">
          <tr>
            <th className="px-6 py-5 text-sm font-bold text-slate-900 uppercase tracking-tight w-1/5">Products</th>
            <th className="px-6 py-5 text-sm font-bold text-slate-900 uppercase tracking-tight w-1/5 border-l border-slate-200">Brand</th>
            <th className="px-6 py-5 text-sm font-bold text-slate-900 uppercase tracking-tight w-1/4 border-l border-slate-200">Products Category</th>
            <th className="px-6 py-5 text-sm font-bold text-slate-900 uppercase tracking-tight border-l border-slate-200">Inspection Charge</th>
            <th className="px-6 py-5 text-sm font-bold text-slate-900 uppercase tracking-tight border-l border-slate-200">Service Charge</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-slate-700 font-medium">{row.product}</td>
                <td className="px-6 py-5 text-slate-700 border-l border-slate-200">{row.brand}</td>
                <td className="px-6 py-5 text-slate-700 border-l border-slate-200">{row.category}</td>
                <td className="px-6 py-5 text-slate-700 border-l border-slate-200">{row.inspection || '-'}</td>
                <td className="px-6 py-5 text-slate-700 border-l border-slate-200">{row.service || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                No matching service charges found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChargeTable;
