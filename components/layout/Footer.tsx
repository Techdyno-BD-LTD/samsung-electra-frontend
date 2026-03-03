import Image from "next/image";
import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#E5F2FF] text-[#4a5568] pt-12 pb-6 border-t border-blue-100">
      {/* Main Container */}
      <div className=" mx-auto mainwidth flex flex-col lg:flex-row justify-between gap-28">

        {/* Company Informations - Separate Div */}
        <div className="space-y-6 w-full lg:w-[25%]">
          <div className="space-y-1">
            <Image
              src="/images/electralogo.webp"
              alt="Samsung Electra"
              width={250}
              height={40}
              className="h-auto"
            />

          </div>

          <p className="text-[15px] leading-relaxed">
            Electra International | Your Comfort Our Promise The Largest Home Appliance Brand In Bangladesh
          </p>

          <div className="space-y-3 text-[15px]">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-full shadow-sm text-blue-600">
                <FaPhone className="text-blue-600" />
              </div>
              <p>+8809639023023 ,<br />+8801713353431</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-full shadow-sm text-blue-600">
                <FaEnvelope className="text-blue-600" />
              </div>
              <p>info@electrabd.com</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-full shadow-sm text-blue-600">
                <FaMapMarkerAlt className="text-blue-600" />
              </div>
              <p>Tropical Mollah Tower (6th Floor), 15/1-15/4 Pragati Sarani, Middle Badda, Dhaka - 1212, Bangladesh</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-[15px] font-semibold text-gray-700">Connect With us</p>
            <div className="flex gap-4 text-blue-800">
              <Link href="#" className="hover:text-blue-500 transition-colors"><FaFacebookF size={20} /></Link>
              <Link href="#" className="hover:text-pink-600 transition-colors"><FaInstagram size={20} /></Link>
              <Link href="#" className="hover:text-red-600 transition-colors"><FaYoutube size={20} /></Link>
              <Link href="#" className="hover:text-blue-700 transition-colors"><FaLinkedinIn size={20} /></Link>
              <Link href="#" className="hover:text-green-500 transition-colors"><FaWhatsapp size={20} /></Link>
            </div>
          </div>
        </div>

        {/* Other 5 Columns in Separate Parent Div */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 flex-1">
          {/* Company Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/brands" className="hover:text-blue-600 transition-colors">Brands</Link></li>
              <li><Link href="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/emi-bank-list" className="hover:text-blue-600 transition-colors">EMI Bank List</Link></li>
              <li>
                <Link href="/career" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  Career <span className="inline-block bg-[#006ce4] text-white text-[9px] px-1.5 py-0.5 rounded animate-pulse">We Are Hiring</span>
                </Link>
              </li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/warranty-policy" className="hover:text-blue-600 transition-colors">Warranty Policy</Link></li>
              <li><Link href="/cancellation-refund" className="hover:text-blue-600 transition-colors">Cancellation & Refund</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Account</h3>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
              <li><Link href="/cart" className="hover:text-blue-600 transition-colors">View cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-blue-600 transition-colors">My Wishlist</Link></li>
              <li><Link href="/track-order" className="hover:text-blue-600 transition-colors">Track My Order</Link></li>
              <li><Link href="/help-ticket" className="hover:text-blue-600 transition-colors">Help Ticket</Link></li>
              <li><Link href="/shipping-details" className="hover:text-blue-600 transition-colors">Shipping Details</Link></li>
              <li><Link href="/compare-products" className="hover:text-blue-600 transition-colors">Compare Products</Link></li>
              <li><Link href="/faqs" className="hover:text-blue-600 transition-colors">Frequently Ask Questions</Link></li>
            </ul>
          </div>

          {/* After Sales Support */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">After Sales Support</h3>
            <div className="space-y-5 text-[15px]">
              <div>
                <p className="font-semibold text-gray-700 mb-1">• Samsung</p>
                <p className="font-medium">+88 09612 300 300<br />08000 300 300<br />(Toll-Free) All Working Days 24/7</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">• Electra</p>
                <p className="font-medium">+88 09639 023 023<br />Saturday-Thursday<br />(9 am-6 pm)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">• Whirlpool</p>
                <p className="font-medium">09610 20 40 20 ,<br />helpdeskbangladesh@<br />whirlpool.com</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">• Philips</p>
                <p className="font-medium">+8809639023023</p>
              </div>
              <button className="w-full bg-[#005faa] text-white py-1 rounded-md font-semibold text-[13px] hover:bg-[#004a80] transition-colors shadow-sm ">
                Service Request
              </button>
            </div>
          </div>

          {/* Popular */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular</h3>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/store-location" className="hover:text-blue-600 transition-colors">Store Location</Link></li>
              <li><Link href="/exchange-product" className="hover:text-blue-600 transition-colors">Exchange Product</Link></li>
              <li><Link href="/kisti" className="hover:text-blue-600 transition-colors">Higher sale kisti</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/blogs-news" className="hover:text-blue-600 transition-colors">Blogs & News</Link></li>
            </ul>
             <div className="space-y-4 mt-20">
  <h3 className="text-xl font-semibold">Secured Payment Method</h3>
  
  <div className="flex gap-2 items-center">
    {/* Cash on Delivery Image Container */}
    <div className=" rounded p-1 flex items-center justify-center">
      <Image 
        src="/images/easycod.png" 
        alt="Cash on Delivery" 
        width={100} // Adjust width as needed
        height={30} // Consistent height for the badge
        className="object-contain"
      />
    </div>

    {/* Easy EMI Payment Image Container */}
    <div className=" rounded p-1 flex items-center justify-center">
      <Image 
        src="/images/easyemi.png" 
        alt="Easy EMI Payment" 
        width={100} // Adjust width as needed
        height={30} // Consistent height for the badge
        className="object-contain"
      />
    </div>
  </div>

  <div className="pt-2">
    <Image
      src="/images/pmethod.png"
      alt="Payment Methods"
      width={250}
      height={60}
      className="w-full h-auto transition-all duration-300"
    />
  </div>

  <p className="text-[#0054A6] text-[15px] font-semibold text-center">
    15% discount on pay with visa Master card
  </p>
</div>
          </div>

          {/* Customer Service & Payments */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Service</h3>
              <ul className="space-y-2.5 text-[15px]">
                <li><Link href="/installation" className="hover:text-blue-600 transition-colors">Installation</Link></li>
                <li><Link href="/service-hour" className="hover:text-blue-600 transition-colors">Service Hour</Link></li>
                <li><Link href="/service-charge" className="hover:text-blue-600 transition-colors">Service Charge</Link></li>
                <li><Link href="/service-payment" className="hover:text-blue-600 transition-colors">Service Payment</Link></li>
                <li><Link href="/chat" className="hover:text-blue-600 transition-colors">Chat With us</Link></li>
              </ul>
            </div>

           
          </div>
        </div>



      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 lg:px-12 mt-12 pt-6 border-t border-blue-200">
        <p className="text-center text-blue-600 text-[15px] font-medium">
          &copy; {currentYear} samsung electra.all rights reserved
        </p>
      </div>
    </footer>
  );
}
