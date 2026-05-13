import b2bData from "@/database/b2b.json";
import Link from "next/link";

export default function B2BPage() {
  const { enquiryForm, corporateClients, nominatedDealers, breadcrumb } = b2bData;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20 lg:pt-20">
      {/* Breadcrumb */}
      <div className="mainwidth mx-auto px-4 mb-8">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">{breadcrumb.home}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800 font-medium">{breadcrumb.current}</span>
        </nav>
      </div>

      <div className=" mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form Details */}
          <div className="lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              {enquiryForm.title}
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {enquiryForm.fields.companyName.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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
                  value={enquiryForm.fields.country.value}
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
                      <input type="checkbox" className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{option}</span>
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
                      <input type="checkbox" className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{option}</span>
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
                  placeholder={enquiryForm.details.placeholder}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Clients Section */}
        <section className="mt-24 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{corporateClients.title}</h2>
          <p className="text-gray-500 mb-12">{corporateClients.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {corporateClients.clients.map((client, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 h-32">
                {/* Image placeholder - in a real app these would be actual assets */}
                <div className="w-full h-full relative flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                  {client.name} Logo
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nominated Dealers Section */}
        <section className="mt-24 p-12 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{nominatedDealers.title}</h2>
            <p className="text-gray-500">{nominatedDealers.subtitle}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">{nominatedDealers.searchLabel}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 appearance-none cursor-pointer">
                  <option>District</option>
                </select>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50 appearance-none cursor-pointer">
                  <option>Area</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {nominatedDealers.dealers.map((dealer, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-inner">
                    {dealer.type}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight h-10 flex items-center">
                    {dealer.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {dealer.address}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">
                      SAMSUNG<span className="text-blue-500">|</span>electra
                    </span>
                    <div className="text-[8px] text-gray-400 font-bold -mt-1">Since-1976</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
