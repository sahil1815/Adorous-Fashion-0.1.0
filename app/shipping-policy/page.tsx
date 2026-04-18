import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | Adorous",
  description: "Learn about delivery timeframes, shipping charges, and coverage at Adorous.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FCFBFA] pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        
        {/* Back Button & Page Title */}
        <div className="mb-6 flex items-center">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-[#B76E79] transition-colors mr-3"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-medium text-[#1A1A1A]">
            Shipping & Delivery Policy
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            At <strong className="text-[#1A1A1A]">Adorous</strong>, we are committed to delivering your orders quickly and securely across Bangladesh. Please review the following details regarding our shipping and delivery process.
          </p>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                1. Delivery Coverage
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We deliver across all major cities and districts in Bangladesh. Some remote areas may experience extended delivery times depending on courier availability.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                2. Delivery Timeframes
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-3">
                <li><strong className="text-[#1A1A1A] font-medium">Inside Dhaka:</strong> Estimated delivery within 24–48 hours.</li>
                <li><strong className="text-[#1A1A1A] font-medium">Outside Dhaka:</strong> Estimated delivery within 3–5 business days.</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed">
                Delivery timelines may vary during peak seasons, government holidays, or due to natural disruptions.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                3. Shipping Charges
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-3">
                <li><strong className="text-[#1A1A1A] font-medium">Inside Dhaka:</strong> Standard flat rate of ৳80.</li>
                <li><strong className="text-[#1A1A1A] font-medium">Outside Dhaka:</strong> Standard flat rate of ৳130.</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed">
                All delivery charges are clearly displayed at checkout before you confirm your order.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                4. Payment & Delivery Method
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cash on Delivery (COD) is available nationwide. Please keep the exact payment amount ready to hand over to the delivery agent upon arrival.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                5. Contact Us
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                For any delivery-related assistance, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 <strong className="text-[#1A1A1A] font-medium">Phone:</strong> +8801700625482</p>
                <p>✉️ <strong className="text-[#1A1A1A] font-medium">Email:</strong> adorous.fashion@gmail.com</p>
              </div>
            </section>

            {/* Outro */}
            <section className="pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                By shopping at <strong className="text-[#1A1A1A]">Adorous</strong>, you acknowledge and agree to the terms outlined in this Shipping & Delivery Policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}