import Link from "next/link";
import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2"; 
import { HiOutlineArrowLongRight } from "react-icons/hi2"; 

export default function TopBar() {
  return (
    <div className="bg-white h-[38px] py-0.5 border-b border-slate-200">
      <div className="mainwidth mx-auto">
        <div className="flex items-center justify-between py-1.5 text-[12px]">
          
          {/* First Part: Support Call */}
          <div className="flex items-center">
            <span className="text-slate-600 font-normal tracking-wide">
              Need Online help? Call Us <span className="text-[#0081FF] font-medium">09639-023023</span> Sat-Thu (09:00AM - 6:00 PM)
            </span>
          </div>

          {/* Second Part: Discount Banner (Middle Section) */}
          <div className="flex items-center gap-3">
  {/* THE VIEWPORT: This "clips" the text when it moves up/down */}
  <div className="h-6 overflow-hidden"> 
    
    {/* THE CARRIER: This is what actually animates */}
    <div className="flex items-center gap-1.5 text-[#001f3f] animate-roll-text">
      <HiOutlineBell className="text-[16px] flex-shrink-0" />
      <span className="whitespace-nowrap font-normal">
        You Will Get <span className="font-bold text-[14px]">50%</span> Discount
      </span>
    </div>
    
  </div>
  
  {/* STATIC BUTTON: Stays in place regardless of the text animation */}
  <Link 
    href="/offers" 
    className="flex items-center gap-2 bg-black text-white px-3 py-0.5 rounded-full hover:bg-slate-800 transition-all text-[11px]"
  >
    <span>Shop now</span>
    <div className="bg-[#1e90ff] rounded-full px-1 flex items-center justify-center">
      <HiOutlineArrowLongRight className="text-white text-[10px]" />
    </div>
  </Link>
</div>

          {/* Third Part: Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/b2b" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
              <div className="relative w-[16px] h-[16px] flex items-center justify-center">
                <Image 
                  src="/images/delaership.png" 
                  alt="B2B / Dealership" 
                  width={500}
                  height={500}
                  className="absolute"
                />
                
              </div>
              <span>B2B / Dealership</span>
            </Link>
            <Link href="/stores" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
              <div className="relative w-[16px] h-[16px] flex items-center justify-center">
                <Image 
                  src="/images/location.png" 
                  alt="Store Location" 
                  width={500}
                  height={500}
                  className="absolute"
                />
              
              </div>
              <span>Store Location</span>
            </Link>
            <Link href="/track" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
              <div className="relative w-[16px] h-[16px] flex items-center justify-center">
                <Image 
                  src="/images/Group.png" 
                  alt="Track Order" 
                  width={500}
                  height={500}
                  className="absolute"
                />
              
              </div>
              <span>Track Order</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}