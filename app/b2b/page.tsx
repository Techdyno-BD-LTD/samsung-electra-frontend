"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import fallbackB2bData from "@/database/b2b.json";
import Image from "next/image";

interface Client {
  name: string;
  logo: string;
}

interface Dealer {
  name: string;
  address: string;
  type: string;
  district?: string;
  area?: string;
}

interface B2bContent {
  breadcrumb: {
    home: string;
    current: string;
  };
  corporateClients: {
    title: string;
    subtitle: string;
    clients: Client[];
  };
  nominatedDealers: {
    title: string;
    subtitle: string;
    searchLabel: string;
    dealers: Dealer[];
  };
}

export default function B2BPage() {
  const [pageData, setPageData] = useState<B2bContent>({
    breadcrumb: fallbackB2bData.breadcrumb,
    corporateClients: fallbackB2bData.corporateClients,
    nominatedDealers: {
      title: fallbackB2bData.nominatedDealers.title,
      subtitle: fallbackB2bData.nominatedDealers.subtitle,
      searchLabel: fallbackB2bData.nominatedDealers.searchLabel,
      dealers: fallbackB2bData.nominatedDealers.dealers as Dealer[],
    },
  });

  const [formData, setFormData] = useState({
    companyName: "",
    yourName: "",
    mobileNumber: "",
    emailAddress: "",
    fullAddress: "",
    division: "",
    district: "",
    country: "Bangladesh",
    enquiryType: [] as string[],
    preferredCategory: [] as string[],
    details: "",
  });

  const [selectedDistrict, setSelectedDistrict] = useState("District");
  const [selectedArea, setSelectedArea] = useState("Area");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Fetch dynamic page contents from backend
  useEffect(() => {
    async function fetchPageData() {
      try {
        const res = await fetch("/api/pages/b2b");
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data[0]) {
            const pageObj = json.data[0];
            if (pageObj.content) {
              const parsed = JSON.parse(pageObj.content);
              setPageData({
                breadcrumb: parsed.breadcrumb || fallbackB2bData.breadcrumb,
                corporateClients: parsed.corporateClients || fallbackB2bData.corporateClients,
                nominatedDealers: parsed.nominatedDealers || fallbackB2bData.nominatedDealers,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic B2B data, using fallback JSON:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, []);

  // Fetch navbar logo URL from backend config
  useEffect(() => {
    async function loadHeader() {
      try {
        const res = await fetch("/api/header");
        if (res.ok) {
          const payload = await res.json();
          setLogoUrl(payload?.data?.logo?.url?.trim() || null);
        }
      } catch (err) {
        console.error("Failed to load header logo:", err);
      }
    }
    loadHeader();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: "enquiryType" | "preferredCategory", option: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const next = current.includes(option)
        ? current.filter((x) => x !== option)
        : [...current, option];
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Front-end validations
    if (
      !formData.companyName.trim() ||
      !formData.yourName.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.emailAddress.trim() ||
      !formData.fullAddress.trim() ||
      !formData.division.trim() ||
      !formData.district.trim() ||
      !formData.details.trim()
    ) {
      setSubmitStatus("error");
      setErrorMessage("Please fill all required fields marked with *");
      return;
    }

    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/v2/b2b-queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          yourName: formData.yourName,
          mobileNumber: formData.mobileNumber,
          emailAddress: formData.emailAddress,
          fullAddress: formData.fullAddress,
          division: formData.division,
          district: formData.district,
          country: formData.country,
          enquiryType: formData.enquiryType.join(", ") || "General Enquiry",
          preferredCategory: formData.preferredCategory.join(", ") || "None Specified",
          details: formData.details,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({
          companyName: "",
          yourName: "",
          mobileNumber: "",
          emailAddress: "",
          fullAddress: "",
          division: "",
          district: "",
          country: "Bangladesh",
          enquiryType: [],
          preferredCategory: [],
          details: "",
        });
      } else {
        const errJson = await res.json();
        setSubmitStatus("error");
        setErrorMessage(errJson.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper arrays for District and Area filtering
  const dealers = pageData.nominatedDealers.dealers || [];

  // Retrieve unique districts and areas based on the explicit fields populated from backend
  const districts = Array.from(
    new Set(
      dealers
        .map((d) => d.district?.trim())
        .filter(Boolean)
    )
  );

  const areas = Array.from(
    new Set(
      dealers
        .filter((d) => selectedDistrict === "District" || d.district?.trim().toLowerCase() === selectedDistrict.toLowerCase())
        .map((d) => d.area?.trim())
        .filter(Boolean)
    )
  );

  const filteredDealers = dealers.filter((d) => {
    const distVal = d.district?.trim() || "";
    const areaVal = d.area?.trim() || "";

    const matchesDistrict =
      selectedDistrict === "District" || distVal.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesArea =
      selectedArea === "Area" || areaVal.toLowerCase() === selectedArea.toLowerCase();

    return matchesDistrict && matchesArea;
  });

  const { enquiryForm } = fallbackB2bData;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20 lg:pt-20">
      {/* Breadcrumb */}
      <div className="mainwidth mx-auto px-4 mb-8">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {pageData.breadcrumb.home}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800 font-medium capitalize">
            {pageData.breadcrumb.current}
          </span>
        </nav>
      </div>

      <div className="mainwidth mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form Details */}
          <div className="lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              {enquiryForm.title}
            </h2>

            {submitStatus === "success" && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl text-green-800 flex items-start space-x-3 animate-fade-in-down">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h4 className="font-bold text-lg mb-1">Enquiry Submitted Successfully!</h4>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. Our corporate representative will review your request
                    and get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-start space-x-3 animate-fade-in-down">
                <svg
                  className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h4 className="font-bold text-lg mb-1">Submission Failed</h4>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.companyName.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.companyName.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.yourName.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="yourName"
                    value={formData.yourName}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.yourName.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.mobileNumber.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.mobileNumber.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.emailAddress.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.emailAddress.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {enquiryForm.fields.fullAddress.label} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder={enquiryForm.fields.fullAddress.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.division.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.division.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.district.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder={enquiryForm.fields.district.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {enquiryForm.fields.country.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </form>
          </div>

          {/* Right Column: Enquiry Type & Categories */}
          <div className="lg:w-1/3 space-y-8">
            {/* Enquiry Type */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {enquiryForm.enquiryType.title}
              </h3>
              <div className="space-y-4">
                {enquiryForm.enquiryType.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={formData.enquiryType.includes(option)}
                        onChange={() => handleCheckboxChange("enquiryType", option)}
                        className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Category */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {enquiryForm.preferredCategory.title}
              </h3>
              <div className="space-y-4">
                {enquiryForm.preferredCategory.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={formData.preferredCategory.includes(option)}
                        onChange={() => handleCheckboxChange("preferredCategory", option)}
                        className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Details / Qty */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                {enquiryForm.details.title}
              </h3>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">
                  {enquiryForm.details.label} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder={enquiryForm.details.placeholder}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Clients Section */}
        <section className="mt-24 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            {pageData.corporateClients.title}
          </h2>
          <p className="text-gray-500 mb-12">{pageData.corporateClients.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {pageData.corporateClients.clients.map((client, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center   duration-500 h-32"
              >
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={180}
                    height={80}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                    {client.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Nominated Dealers Section */}
        <section className="mt-24 p-12 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              {pageData.nominatedDealers.title}
            </h2>
            <p className="text-gray-500">{pageData.nominatedDealers.subtitle}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                {pageData.nominatedDealers.searchLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedArea("Area"); // Reset area on district change
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 appearance-none cursor-pointer"
                >
                  <option value="District">District</option>
                  {districts.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 appearance-none cursor-pointer"
                >
                  <option value="Area">Area</option>
                  {areas.map((a, i) => (
                    <option key={i} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-inner">
                      {dealer.type}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight h-10 flex items-center">
                      {dealer.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed min-h-[30px]">
                      {dealer.address}
                    </p>
                    <div className="pt-2 flex flex-col items-center w-full">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt="SAMSUNG electra"
                          width={120}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                      ) : (
                        <>
                          <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">
                            SAMSUNG<span className="text-blue-500">|</span>electra
                          </span>
                          <div className="text-[8px] text-gray-400 font-bold -mt-1">Since-1976</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 font-medium">
                No nominated dealers found matching selection.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
