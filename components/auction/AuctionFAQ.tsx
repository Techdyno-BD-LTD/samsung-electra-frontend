import React from "react";

interface AuctionFAQProps {
  auctionName: string;
}

const AuctionFAQ: React.FC<AuctionFAQProps> = ({ auctionName }) => {
  return (
    <section className="mt-12 border-t border-slate-100 pt-10 pb-16">
      <div className="max-w-7xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800 lg:text-2xl">
          Looking for Best {auctionName} in Bangladesh?
        </h2>

        <div className="space-y-8">
          {/* Question 1 */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-slate-700 lg:text-[16px]">
              Is Electra the most reliable source for genuine auction appliances in Bangladesh?
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
              Yes, ElectraBD guarantees 100% genuine and official home appliances, including{" "}
              <span className="font-bold">Smart LED TV</span>,{" "}
              <span className="font-bold">Inverter AC</span>,{" "}
              <span className="font-bold">Washing Machine</span>, and various{" "}
              <span className="font-bold">Refrigerator & Freezer</span> models through our live auctions. Every item comes with the full Official Manufacturer&apos;s Warranty, ensuring complete peace of mind and product authenticity across Bangladesh.
            </p>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-slate-700 lg:text-[16px]">
              Does Electra offer Free Delivery and Free Installation for auction products?
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
              Absolutely. We provide Free Delivery in selected areas to make your auction wins hassle-free. Furthermore, complex items like Split AC and large Side by Side Refrigerators include Free Installation services by our expert technicians, ensuring perfect setup and immediate use of your won appliance.
            </p>
          </div>

          {/* Question 3 */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-slate-700 lg:text-[16px]">
              How does Electra ensure the best prices and flexible payment options?
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
              We strive to offer the best <span className="font-bold">Home Appliances Price in Bangladesh</span> through a low-cost online model. We support secure online payments, Cash on Delivery (COD), and provide attractive <span className="font-bold">0% Interest Easy EMI</span> facilities on major bank credit cards for our all products
            </p>
          </div>

          {/* Duplicate question as per category design */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold text-slate-700 lg:text-[16px]">
              How does Electra ensure the best prices and flexible payment options?
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
              We strive to offer the best <span className="font-bold">Home Appliances Price in Bangladesh</span> through a low-cost online model. We support secure online payments, Cash on Delivery (COD), and provide attractive <span className="font-bold">0% Interest Easy EMI</span> facilities on major bank credit cards for our all products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionFAQ;
