import React from 'react';

interface HourRow {
  day: string;
  time: string;
  isOpen?: boolean;
}

interface HoursPanelProps {
  data: {
    header: string;
    rows: HourRow[];
    footer: string;
  };
}

const HoursPanel: React.FC<HoursPanelProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="space-y-6 w-9/12 mx-auto">
        {data.header && (
          <div className="bg-[#EBF3FF] text-[#1e3a8a] py-3 px-6 rounded-lg font-medium text-center lg:text-left">
            • {data.header}
          </div>
        )}

        <div className="divide-y divide-slate-100 space-y-2">
          {data.rows.map((row, i) => (
            <div key={i} className="py-4 px-4 flex flex-col bg-[#f4f4f4] sm:flex-row sm:items-center justify-between ">
              <div className="flex items-center gap-3">
                <span className="text-[#1e3a8a] text-lg font-semibold">• {row.day}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-medium">{row.time}</span>
                {row.isOpen && (
                  <span className="bg-[#10B981] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Open
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {data.footer && (
          <div className="bg-[#FFF7E6] border border-[#FFE7B3] rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[#92400E] text-sm font-medium">
              {data.footer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoursPanel;
