"use client";

import { useState, useEffect } from "react";
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/features/toast/toastSlice";
import Skeleton from "@/components/common/Skeleton";

interface ContactContent {
    form_title: string;
    form_description: string;
    submit_button_text: string;
    support_title: string;
    support_content: string;
    accessibility_title: string;
    accessibility_content: string;
    feedback_title: string;
    feedback_content: string;
    feedback_button_text: string;
    address_label: string;
    address: string;
    phone_label: string;
    phone: string;
    email_label: string;
    email: string;
}

export default function Page() {
    const dispatch = useAppDispatch();
    const [data, setData] = useState<ContactContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/pages/contact-us");
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    const page = result.data[0];
                    if (page.content) {
                        setData(JSON.parse(page.content));
                    }
                }
            } catch (error) {
                console.error("Error fetching contact page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const requiredFields = [
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone Number' },
            { key: 'email', label: 'E-mail' },
            { key: 'message', label: 'Message' }
        ];

        for (const field of requiredFields) {
            if (!formData[field.key as keyof typeof formData].trim()) {
                const element = document.getElementsByName(field.key)[0] as HTMLElement;
                if (element) {
                    element.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('border-red-500');
                    setTimeout(() => element.classList.remove('border-red-500'), 3000);
                }
                dispatch(showToast({ message: `${field.label} is required.`, type: "error" }));
                return;
            }
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/v2/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                dispatch(showToast({ message: "Message sent successfully! We'll get back to you soon.", type: "success" }));
                setFormData({ name: "", phone: "", email: "", message: "" });
            } else {
                dispatch(showToast({ message: "Failed to send message. Please try again later.", type: "error" }));
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            dispatch(showToast({ message: "An error occurred. Please try again.", type: "error" }));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto w-full px-4 lg:px-12 py-12 space-y-12 animate-in fade-in duration-500">
                <Skeleton className="h-10 w-1/4 rounded-xl" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[600px] w-full rounded-2xl" />
                    <Skeleton className="h-[600px] w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <p className="text-slate-500">Contact page content not found.</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-11/12 mx-auto px-4 mt-10 md:mt-8 md:px-10 py-6 md:py-12 flex flex-col gap-8 md:gap-12 bg-white">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Contact Us</h1>

            {/* Main Section: Form & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">

                {/* Left: Contact Form */}
                <div className="bg-[#F6F6F6] rounded-2xl p-5 md:p-10 lg:p-8 xl:p-12 shadow-sm border border-slate-100">
                    <div className="mb-6 lg:mb-10">
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">{data.form_title}</h2>
                        <p className="text-[13px] md:text-sm text-slate-500 leading-relaxed max-w-xl">
                            {data.form_description}
                        </p>
                    </div>

                    <form className="flex flex-col gap-4 md:gap-6" onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                placeholder="Phone number"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Your E-mail <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs md:text-sm font-semibold text-slate-700">Your Message <span className="text-red-500">*</span></label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg p-2.5 md:p-3 h-28 lg:h-40 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#1D80FE] text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-lg w-fit hover:bg-blue-600 transition-all shadow-md active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? <Skeleton className="w-4 h-4 rounded-full" /> : null}
                            {data.submit_button_text}
                        </button>
                    </form>
                </div>

                {/* Right: Support Information */}
                <div className="bg-[#F6F6F6] rounded-2xl p-5 md:p-10 lg:p-8 xl:p-12 shadow-sm border border-slate-100 flex flex-col justify-between gap-6 md:gap-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3 lg:mb-2">{data.support_title}</h2>
                        <p className="text-[16px] xl:text-[20px] text-slate-600 leading-[1.6]">
                            {data.support_content}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base xl:text-xl font-semibold text-slate-800 mb-2 lg:mb-4">{data.accessibility_title}</h3>
                        <p className="text-[14px] xl:text-[17px] text-slate-600 leading-[1.6]">
                            {data.accessibility_content}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base xl:text-xl font-semibold text-slate-800 mb-2 lg:mb-4">{data.feedback_title}</h3>
                        <p className="text-[14px] xl:text-[17px] text-slate-600 leading-[1.6] mb-5 lg:mb-8">
                            {data.feedback_content}
                        </p>
                        <button className="flex items-center gap-2 bg-[#1D80FE] text-white font-bold py-2.5 md:py-3 px-5 md:px-6 rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95 text-[11px] lg:text-sm uppercase tracking-wider">
                            {data.feedback_button_text}
                            <FiArrowRight className="text-base lg:text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-2 md:mt-4">
                <Card
                    icon="FiMapPin"
                    title={data.address_label}
                    text={data.address}
                />
                <Card
                    icon="FiPhone"
                    title={data.phone_label}
                    text={data.phone}
                />
                <Card
                    icon="FiMail"
                    title={data.email_label}
                    text={data.email}
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

    const lines = text ? text.split('\n') : [];

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