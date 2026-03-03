import Link from "next/link";
import { 
  FaHome, 
  FaTh, 
  FaBullhorn, 
  FaShoppingCart, 
  FaUser 
} from "react-icons/fa";

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {/* Home - Active (darker blue) */}
        <Link href="/" className="flex flex-col items-center p-2 text-blue-600">
          <FaHome size={20} />
         
        </Link>

        {/* Categories */}
        <Link href="/categories" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <FaTh size={20} />
         
        </Link>

        {/* Deals/Promotions */}
        <Link href="/deals" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <FaBullhorn size={20} />
          
        </Link>

        {/* Cart */}
        <Link href="/cart" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
          <FaShoppingCart size={20} />
        
          {/* Optional: Cart badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            0
          </span>
        </Link>

        {/* Profile */}
        <Link href="/profile" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <FaUser size={20} />
         
        </Link>
      </div>
    </div>
  );
}
