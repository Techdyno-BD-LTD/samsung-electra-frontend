type TimelineStep = {
  label: string;
  status: 'completed' | 'current' | 'pending';
  date: string | null;
};

export default function OrderTimeline({ timeline }: { timeline: TimelineStep[] }) {
  return (
    <div className="bg-white rounded-[30px] border border-slate-100 shadow-sm p-8 md:p-12 mb-10">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        {/* Horizontal Line (Desktop) */}
        <div className="hidden md:block absolute top-[22px] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-slate-200 -z-0"></div>

        {timeline.map((step, index) => {
          const isCompleted = step.status === 'completed';
          
          return (
            <div key={index} className="relative flex flex-row md:flex-col items-center md:text-center z-10 w-full md:w-auto">
              {/* Circle */}
              <div 
                className={`w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#007BFF] border-white shadow-[0_0_0_4px_#E6F2FF]' 
                    : 'bg-slate-100 border-white'
                }`}
              >
                {isCompleted && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Text Info */}
              <div className="ml-4 md:ml-0 md:mt-4 flex flex-col items-start md:items-center">
                <h4 className={`text-sm md:text-base font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </h4>
                {step.date && (
                  <div className="text-[11px] text-slate-400 mt-1">
                    {new Date(step.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    <br />
                    {new Date(step.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
