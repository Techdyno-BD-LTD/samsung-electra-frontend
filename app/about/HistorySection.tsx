import React from 'react';

interface HistorySectionProps {
    sectionTitle: string;
    content: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({ sectionTitle, content }) => {
    return (
        <section className="mt-8">
            <div className="w-full bg-[#E7F1FD] py-4 rounded-sm mb-6 flex justify-center items-center">
                <h2 className="text-xl lg:text-3xl  font-semibold text-[#005B9E]">
                    {sectionTitle}
                </h2>
            </div>
            <div
                className=" max-w-none text-slate-800 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </section>
    );
};

export default HistorySection;
