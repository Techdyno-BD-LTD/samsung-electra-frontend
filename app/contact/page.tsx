"use client";


import contactData from "@/database/contact.json";
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";



export default function Page() {
    return (
        <div className="w-full lg:w-11/12 mx-auto px-4 mt-10 md:mt-8 md:px-10 py-6 md:py-12 flex flex-col gap-8 md:gap-12 bg-white">
            {/* Breadcrumb / Title */}


            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Contact Us</h1>

            {/* Main Section: Form & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">

                {/* Left: Contact Form */}
                <div className="bg-[#F6F6F6] rounded-2xl p-5 md:p-10 lg:p-8 xl:p-12 shadow-sm border border-slate-100">
                    <div className="mb-6 lg:mb-10">
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">{contactData.form_title}</h2>
                        <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed max-w-xl">
                            {contactData.form_description}
                        </p>
                    </div>

                    <form className="flex flex-col gap-4 md:gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Name *</label>
                            <input
                                type="text"
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Phone Number *</label>
                            <input
                                type="text"
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Your E-mail *</label>
                            <input
                                type="email"
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Your Message *</label>
                            <textarea
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 h-28 lg:h-40 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-[#1D80FE] text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-lg w-fit hover:bg-blue-600 transition-all shadow-md active:scale-95 text-sm"
                        >
                            {contactData.submit_button_text}
                        </button>
                    </form>
                </div>

                {/* Right: Support Information */}
                <div className="bg-[#F6F6F6] rounded-2xl p-5 md:p-10 lg:p-8 xl:p-12 shadow-sm border border-slate-100 flex flex-col justify-between gap-6 md:gap-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3 lg:mb-2">{contactData.support_title}</h2>
                        <p className="text-[16px] xl:text-[20px] text-slate-600 leading-[1.6]">
                            {contactData.support_content}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base xl:text-xl font-semibold text-slate-800 mb-2 lg:mb-4">{contactData.accessibility_title}</h3>
                        <p className="text-[14px] xl:text-[17px] text-slate-600 leading-[1.6]">
                            {contactData.accessibility_content}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base xl:text-xl font-semibold text-slate-800 mb-2 lg:mb-4">{contactData.feedback_title}</h3>
                        <p className="text-[14px] xl:text-[17px] text-slate-600 leading-[1.6] mb-5 lg:mb-8">
                            {contactData.feedback_content}
                        </p>
                        <button className="flex items-center gap-2 bg-[#1D80FE] text-white font-bold py-2.5 md:py-3 px-5 md:px-6 rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95 text-[11px] lg:text-sm uppercase tracking-wider">
                            {contactData.feedback_button_text}
                            <FiArrowRight className="text-base lg:text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-2 md:mt-4">
                <Card
                    icon="FiMapPin"
                    title={contactData.address_label}
                    text={contactData.address}
                />
                <Card
                    icon="FiPhone"
                    title={contactData.phone_label}
                    text={contactData.phone}
                />
                <Card
                    icon="FiMail"
                    title={contactData.email_label}
                    text={contactData.email}
                />
            </div>
        </div>
    );
}

function Card({ icon, title, text }: { icon: string; title: string; text: string }) {
    const renderIcon = () => {
        switch (icon) {
            case "FiMapPin": return <FiMapPin className="text-white text-xl md:text-2xl" />;
            case "FiPhone": return <FiPhone className="text-white text-xl md:text-2xl" />;
            case "FiMail": return <FiMail className="text-white text-2xl" />;
            default: return null;
        }
    };

    const lines = text.split('\n');

    return (
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-10 flex flex-col items-center text-center group transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:bg-[#1D80FE] transition-colors duration-300">
                {renderIcon()}
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2 md:mb-4 tracking-tight">
                {title}
            </h3>

            <div className="space-y-1">
                {lines.map((line, i) => (
                    <p key={i} className="text-[14px] 2xl:text-[17px] text-slate-500 font-medium leading-relaxed">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}