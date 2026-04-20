"use client";

import React, { useState } from "react";
import { 
  FiSearch, 
  FiTarget, 
  FiCopy, 
  FiShare2, 
  FiChevronDown, 
  FiChevronUp,
  FiPhoneCall,
  FiMapPin 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

const StoreLocationsPage = () => {
  const [openHours, setOpenHours] = useState(false);

  const stores = [
    {
      id: 1,
      title: "Electra International Abdullapur, Dhaka",
      address: "Mojidullah Matbor Market, Abdullapur Bazar, Abdullapur, Keranigonj, Dhaka",
      phone: "+8801713092219",
      hours: [
        { day: "Saturday", time: "9:00 am - 9:00 pm" },
        { day: "Sunday", time: "9:00 am - 9:00 pm" },
        { day: "Monday", time: "9:00 am - 9:00 pm" },
        { day: "Tuesday", time: "9:00 am - 9:00 pm" },
        { day: "Wednesday", time: "9:00 am - 9:00 pm" },
        { day: "Thursday", time: "9:00 am - 9:00 pm" },
        { day: "Friday", time: "9:00 am - 9:00 pm" }
      ]
    },
    {
       id: 2,
       title: "Electra International Abdullapur, Dhaka",
       address: "Mojidullah Matbor Market, Abdullapur Bazar, Abdullapur, Keranigonj, Dhaka",
       phone: "+8801713092219",
       hours: []
    }
  ];

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Store Locations</h2>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
           {/* Search Section */}
           <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Enter - district- thana etc...."
                  className="w-full bg-white border border-slate-200 rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fe8]/10 transition-all font-medium pr-16"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#001b33] text-white p-2.5 rounded-lg hover:bg-black transition-colors">
                  <FiSearch />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center">
                 <select className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none">
                   <option>Service Center</option>
                 </select>
                 <select className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none">
                   <option>Division</option>
                 </select>
                 <select className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none">
                   <option>District</option>
                 </select>
                 <button className="w-full lg:w-fit bg-[#2b7fe8] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#1a6ed9] transition-all">
                   <FiTarget className="text-lg" />
                   <span>Search your location</span>
                 </button>
              </div>
           </div>

           {/* Store Cards */}
           <div className="space-y-6">
              {stores.map((store) => (
                <div key={store.id} className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
                  {/* Store Badge Ribbon */}
                  <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none">
                    <div className="absolute top-[18px] right-[-24px] bg-[#2b7fe8] text-white text-[10px] font-bold py-1 px-8 rotate-45 shadow-sm transform-gpu tracking-wider">
                      Store
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 pr-12 lg:pr-0">
                      <h3 className="text-lg lg:text-xl font-semibold text-slate-900 leading-tight">
                        {store.title}
                      </h3>
                      <div className="flex items-center gap-3 text-slate-400">
                        <button className="hover:text-[#2b7fe8] transition-colors"><FiCopy /></button>
                        <button className="hover:text-[#2b7fe8] transition-colors"><FiShare2 /></button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <p className="text-sm lg:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
                        {store.address}
                      </p>
                      <p className="text-sm lg:text-base text-slate-800 font-bold">
                        Phone: {store.phone}
                      </p>
                    </div>

                    {/* Opening Hours */}
                    <div className="mb-8">
                      <button 
                        onClick={() => setOpenHours(!openHours)}
                        className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-800 hover:bg-blue-50 transition-colors"
                      >
                         <span>Store Opening Hours</span>
                         {openHours ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      
                      {openHours && store.hours.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 text-[10px] lg:text-[11px] font-medium text-slate-500 animate-in fade-in slide-in-from-top-1 duration-200">
                           {store.hours.map((h, i) => (
                             <div key={i} className="flex justify-between border-b border-slate-50 pb-1">
                               <span className="text-slate-700">{h.day}</span>
                               <span className="font-bold">: {h.time}</span>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <button className="flex items-center justify-center gap-2 bg-[#2b7fe8] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#1a6ed9] transition-all shadow-sm">
                         <FiPhoneCall /> Directly Call
                       </button>
                       <button className="flex items-center justify-center gap-2 bg-[#2b7fe8] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#1a6ed9] transition-all shadow-sm">
                         <FaWhatsapp /> Directly Message
                       </button>
                       <button className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all">
                         <FiMapPin /> View map
                       </button>
                    </div>
                  </div>
                </div>
              ))}
           </div>

           {/* More Loading Footer */}
           <div className="flex justify-center pt-4">
              <button className="flex items-center gap-2 text-slate-500 text-sm font-semibold hover:text-slate-800 transition-colors">
                 <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                 <span>More Loading</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocationsPage;
