import React from 'react';
import Link from 'next/link';
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

export const dynamic = 'force-dynamic';

async function getAboutData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/pages/about`, { cache: 'no-store' });
        if (!res.ok) return null;
        const result = await res.json();
        const page = result.data?.[0];
        if (!page || !page.content) return null;
        return JSON.parse(page.content);
    } catch (e) {
        console.error('Error fetching about data:', e);
        return null;
    }
}

const About = async () => {
    const data = await getAboutData();

    if (!data) {
        return (
            <div className="flex flex-col gap-6 pb-12 mt-20 px-4 max-w-7xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-slate-800">Page Content Not Available</h1>
                <p className="text-slate-500">Please check back later or contact support.</p>
                <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
            </div>
        );
    }

    const { 
        title, founder, history, directors, missionVision, 
        retails, distribution, brands, services, 
        network, sisterConcerns, inquiry, contactBanner 
    } = data;

    return (
        <div className="flex flex-col gap-6 pb-12 mt-20 px-4 max-w-[1400px] mx-auto">
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
            {title && <AboutHero title={title} />}

            {/* ═══════════════ FOUNDER SECTION ═══════════════ */}
            {founder && (
                <FounderSection
                    sectionTitle={founder.sectionTitle}
                    name={founder.name}
                    year={founder.year}
                    description={founder.description}
                    image={founder.image}
                />
            )}

            {/* ═══════════════ COMPANY HISTORY SECTION ═══════════════ */}
            {history && (
                <HistorySection
                    sectionTitle={history.sectionTitle}
                    content={history.content}
                />
            )}

            {/* ═══════════════ DIRECTORS SECTION ═══════════════ */}
            {directors && directors.list && (
                <DirectorsSection
                    sectionTitle={directors.sectionTitle}
                    list={directors.list}
                />
            )}

            {/* ═══════════════ MISSION / VISION / WHO WE ARE ═══════════════ */}
            {missionVision && missionVision.items && (
                <MissionVisionSection items={missionVision.items} />
            )}

            {/* ═══════════════ RETAILS SECTION ═══════════════ */}
            {retails && (
                <ContentSection
                    title={retails.title}
                    paragraphs={retails.paragraphs}
                    image={retails.image}
                />
            )}

            {/* ═══════════════ DISTRIBUTION SECTION ═══════════════ */}
            {distribution && (
                <ContentSection
                    title={distribution.title}
                    paragraphs={distribution.paragraphs}
                    image={distribution.image}
                    isReversed={true}
                />
            )}

            {/* ═══════════════ BRANDS SECTION ═══════════════ */}
            {brands && (
                <BrandsSection
                    title={brands.title}
                    subtitle={brands.subtitle}
                    list={brands.list}
                />
            )}

            {/* ═══════════════ SERVICES SECTION ═══════════════ */}
            {services && (
                <ServicesSection
                    title={services.title}
                    subtitle={services.subtitle}
                    description={services.description}
                    images={services.images}
                />
            )}

            {/* ═══════════════ NETWORK SECTION ═══════════════ */}
            {network && (
                <NetworkSection
                    title={network.title}
                    stats={network.stats}
                    image={network.image}
                />
            )}

            {/* ═══════════════ SISTER CONCERNS SECTION ═══════════════ */}
            {sisterConcerns && (
                <SisterConcerns
                    title={sisterConcerns.title}
                    subtitle={sisterConcerns.subtitle}
                    list={sisterConcerns.list}
                />
            )}

            {/* ═══════════════ INQUIRY SECTION ═══════════════ */}
            {inquiry && (
                <InquirySection
                    title={inquiry.title}
                    subtitle={inquiry.subtitle}
                    btnText={inquiry.btnText}
                />
            )}

            {/* ═══════════════ CONTACT BANNER ═══════════════ */}
            {contactBanner && (
                <ContactBanner
                    title={contactBanner.title}
                    description={contactBanner.description}
                    btnText={contactBanner.btnText}
                />
            )}
        </div>
    );
};

export default About;


