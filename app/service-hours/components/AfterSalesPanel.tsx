import React from 'react';

interface AfterSalesPanelProps {
  data: {
    header: string;
    content: string;
    whatsapp: {
      text: string;
      link: string;
    };
  };
}

const AfterSalesPanel: React.FC<AfterSalesPanelProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="space-y-8">
        {data.header && (
          <div className="bg-[#EBF3FF] text-[#1e3a8a] py-3 px-6 rounded-lg font-bold text-center lg:text-xl">
            {data.header}
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {data.whatsapp && (
          <div className="pt-4">
            <a
              href={data.whatsapp.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0084FF] hover:bg-[#0073e6] text-white px-10 py-2 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.391l-.715 2.614 2.677-.701a5.727 5.727 0 002.709.693c3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.391 8.214c-.145.405-.84.739-1.159.782-.318.043-.71.072-2.144-.521-1.84-.753-3.028-2.614-3.115-2.729-.087-.116-.71-.941-.71-1.839s.464-1.347.623-1.535c.159-.188.348-.232.464-.232h.333c.116 0 .275.014.405.318.145.348.492 1.202.536 1.289.043.087.072.188.014.304-.058.116-.087.188-.174.289l-.261.304c-.087.087-.188.188-.072.377.116.188.507.84 1.086 1.361.739.666 1.361.869 1.549.97.188.101.304.087.42-.043.116-.13.492-.579.623-.782.13-.203.261-.174.434-.116.174.058 1.101.521 1.289.608.188.087.318.13.362.203.043.087.043.507-.101.912z" />
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              {data.whatsapp.text}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfterSalesPanel;
