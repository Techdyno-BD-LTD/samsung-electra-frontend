import Image from 'next/image';

type OrderItem = {
  id: number;
  name: string;
  thumbnail: string;
  variation: string | null;
  price: number;
  quantity: number;
  model: string;
};

type OrderSummary = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

export default function OrderDetails({ items, summary }: { items: OrderItem[], summary: OrderSummary }) {
  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  return (
    <div className="bg-[#F8F9FA] rounded-[30px] p-6 md:p-10">
      <h3 className="text-xl font-bold text-slate-900 mb-8">Product Details</h3>
      
      {/* Items List */}
      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-6 border border-slate-100 shadow-sm">
            <div className="relative w-full sm:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
              <Image 
                src={item.thumbnail} 
                alt={item.name} 
                fill 
                className="object-contain p-2"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <h4 className="text-lg md:text-xl font-bold text-slate-900 leading-tight max-w-xl">
                    {item.name}
                  </h4>
                  <span className="text-xl md:text-2xl font-black text-[#007BFF]">
                    {formatPrice(item.price)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                  {item.variation && (
                    <p>{item.variation}</p>
                  )}
                  {item.model && (
                    <p>Model : <span className="text-slate-900">{item.model}</span></p>
                  )}
                  <p>Qty : <span className="text-slate-900 font-bold">{item.quantity}</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Save</span>
          <span className="text-slate-900 font-bold">{formatPrice(summary.discount)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Store Pickup</span>
          <span className="text-slate-900 font-bold">Free</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>TAX</span>
          <span className="text-slate-900 font-bold">{formatPrice(summary.tax)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Delivery</span>
          <span className="text-slate-900 font-bold">{summary.shipping > 0 ? formatPrice(summary.shipping) : 'Free/ Charge'}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Coupon Code</span>
          <span className="text-slate-900 font-bold">0</span>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xl font-bold text-slate-900">Total Amount :</span>
          <span className="text-2xl md:text-3xl font-black text-slate-900">{formatPrice(summary.total)}</span>
        </div>
      </div>
    </div>
  );
}
