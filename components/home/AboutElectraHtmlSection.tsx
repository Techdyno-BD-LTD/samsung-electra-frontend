const aboutElectraHtml = `
  <h2>Electra International: The Ultimate Destination for Home Appliances with Unmatched Value in Bangladesh.</h2>
  <h3>Is Electra the most reliable source for genuine appliances in Bangladesh?</h3>
  <p>
    Yes, ElectraBD guarantees 100% genuine and official home appliances, including
    <strong> Smart LED TV</strong>, <strong>Inverter AC</strong>,
    <strong> Washing Machine</strong>, and various
    <strong> Refrigerator &amp; Freezer</strong> models. Every item comes with the full
    Official Manufacturer's Warranty, ensuring complete peace of mind and product
    authenticity across Bangladesh.
  </p>
  <h3>Does Electra offer Free Delivery and Free Installation services?</h3>
  <p>
    Absolutely. We provide Free Delivery in selected areas to make your purchase
    hassle-free. Furthermore, complex items like Split AC and large Side by Side
    Refrigerators include Free Installation services by our expert technicians,
    ensuring perfect setup and immediate use of your appliance.
  </p>
  <h3>How does Electra ensure the best prices and flexible payment options?</h3>
  <p>
    We strive to offer the best Home Appliances Price in Bangladesh through a
    low-cost online model. We support secure online payments, Cash on Delivery
    (COD), and provide attractive 0% Interest Easy EMI facilities on major bank
    credit cards for all products.
  </p>
`;

export default function AboutElectraHtmlSection() {
  return (
    <section className="rounded-sm  ">
      <div
        className="space-y-4 text-[15px] leading-relaxed text-slate-700 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-slate-300 [&_h2]:pb-3 [&_h2]:text-[clamp(1.45rem,2.4vw,2.2rem)] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:text-[clamp(1.1rem,1.6vw,1.6rem)] [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-slate-800 [&_p]:text-[clamp(0.95rem,1.2vw,1.15rem)] [&_strong]:font-semibold [&_strong]:text-slate-800"
        dangerouslySetInnerHTML={{ __html: aboutElectraHtml }}
      />
    </section>
  );
}