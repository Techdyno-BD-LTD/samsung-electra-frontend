import React from 'react';
import Link from 'next/link';
import aboutData from '@/database/about.json';
import AboutHero from './AboutHero';
import FounderSection from './FounderSection';
import HistorySection from './HistorySection';
import MissionVisionSection from './MissionVisionSection';
import ContentSection from './ContentSection';
import DirectorsSection from './DirectorsSection';
import BrandsSection from './BrandsSection';
import ServicesSection from './ServicesSection';
import NetworkSection from './NetworkSection';
import SisterConcerns from './SisterConcerns';
import InquirySection from './InquirySection';
import ContactBanner from './ContactBanner';

const About = () => {
    const { title, founder, history, directors, missionVision, retails, distribution, brands, services, network, sisterConcerns, inquiry, contactBanner } = aboutData;



    return (
        <div className="flex flex-col gap-6 pb-12 mt-20">
            {/* ═══════════════ BREADCRUMB ═══════════════ */}
            <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-[12px] leading-none text-slate-500 lg:text-sm"
            >
                <Link href="/" className="transition hover:text-slate-700">
                    Home
                </Link>
                <span className="text-slate-400">›</span>
                <span className="text-slate-700 font-medium">About us</span>
            </nav>

            {/* ═══════════════ MAIN TITLE (HERO) ═══════════════ */}
            <AboutHero title={title} />


            {/* ═══════════════ FOUNDER SECTION ═══════════════ */}
            <FounderSection
                sectionTitle={founder.sectionTitle}
                name={founder.name}
                year={founder.year}
                description={founder.description}
            />

            {/* ═══════════════ COMPANY HISTORY SECTION ═══════════════ */}
            <HistorySection
                sectionTitle={history.sectionTitle}
                content={history.content}
            />

            {/* ═══════════════ DIRECTORS SECTION ═══════════════ */}
            <DirectorsSection
                sectionTitle={directors.sectionTitle}
                list={directors.list}
            />

            {/* ═══════════════ MISSION / VISION / WHO WE ARE ═══════════════ */}
            <MissionVisionSection items={missionVision.items} />

            {/* ═══════════════ RETAILS SECTION ═══════════════ */}
            <ContentSection
                title={retails.title}
                paragraphs={retails.paragraphs}
                image={retails.image}
            />

            {/* ═══════════════ DISTRIBUTION SECTION ═══════════════ */}
            <ContentSection
                title={distribution.title}
                paragraphs={distribution.paragraphs}
                image={distribution.image}
                isReversed={true}
            />

            {/* ═══════════════ BRANDS SECTION ═══════════════ */}
            <BrandsSection
                title={brands.title}
                subtitle={brands.subtitle}
                list={brands.list}
            />

            {/* ═══════════════ SERVICES SECTION ═══════════════ */}
            <ServicesSection
                title={services.title}
                subtitle={services.subtitle}
                description={services.description}
                images={services.images}
            />

            {/* ═══════════════ NETWORK SECTION ═══════════════ */}
            <NetworkSection
                title={network.title}
                stats={network.stats}
                image={network.image}
            />

            {/* ═══════════════ SISTER CONCERNS SECTION ═══════════════ */}
            <SisterConcerns
                title={sisterConcerns.title}
                subtitle={sisterConcerns.subtitle}
                list={sisterConcerns.list}
            />

            {/* ═══════════════ INQUIRY SECTION ═══════════════ */}
            <InquirySection
                title={inquiry.title}
                subtitle={inquiry.subtitle}
                btnText={inquiry.btnText}
            />

            {/* ═══════════════ CONTACT BANNER ═══════════════ */}
            <ContactBanner
                title={contactBanner.title}
                description={contactBanner.description}
                btnText={contactBanner.btnText}
            />

        </div>
    );
};





export default About;


