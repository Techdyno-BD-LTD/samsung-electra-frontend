import React from 'react';
import { HiOutlineUsers, HiOutlineLightBulb, HiOutlineRocketLaunch } from "react-icons/hi2";

interface MissionVisionItem {
    title: string;
    description: string;
    icon: string;
    isHighlighted?: boolean;
}

interface MissionVisionSectionProps {
    items: MissionVisionItem[];
}

const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ items }) => {
    const getIcon = (iconName: string, isHighlighted: boolean) => {
        const iconClasses = `w-8 h-8 ${isHighlighted ? 'text-white' : 'text-slate-400'}`;
        switch (iconName) {
            case 'Groups':
                return <HiOutlineUsers className={iconClasses} />;
            case 'Target':
                return <HiOutlineLightBulb className={iconClasses} />;
            case 'Rocket':
                return <HiOutlineRocketLaunch className={iconClasses} />;
            default:
                return <HiOutlineUsers className={iconClasses} />;
        }
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-4 lg:px-0">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-lg border transition-all duration-300 flex flex-col gap-12
                        ${item.isHighlighted
                            ? 'bg-[#1D81FF] border-[#1D81FF] text-white shadow-lg'
                            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                        }`}
                >
                    <div className="flex justify-start">
                        {getIcon(item.icon, !!item.isHighlighted)}
                    </div>
                    <div>
                        <h3 className={`text-xl 2xl:text-4xl font-semibold mb-6 ${item.isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                            {item.title}
                        </h3>
                        <p className={`text-[16px] lg:text-[18px] 2xl:text-[24px] leading-relaxed ${item.isHighlighted ? 'text-white/90' : 'text-slate-600'}`}>
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
};


export default MissionVisionSection;
