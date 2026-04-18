import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Exchange Policy | Adorous",
  description: "Read about the exchange policy, eligibility, and charges at Adorous.",
};

export default function ExchangePolicyPage() {
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
            Exchange Policy
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            At <strong className="text-[#1A1A1A]">Adorous</strong>, we aim to ensure your complete satisfaction with every purchase. Please read the following terms carefully before requesting an exchange.
          </p>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                1. Eligibility for Exchange
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Customers can request a size or color exchange in the presence of the delivery agent. The product must be eligible for exchange, as mentioned on the product page. Products marked as non-exchangeable are not eligible for exchange.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                2. Stock Availability
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                All exchanges are subject to product availability. If the desired size or color is unavailable, the exchange request may not be processed.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                3. Exchange Charges
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Customers are responsible for the full logistics cost, which includes both the delivery charge for the exchanged item and the return delivery charge for the original product.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                4. Contact Us
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                For any exchange-related queries or support, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 <strong className="text-[#1A1A1A] font-medium">Phone:</strong> +8801700625482</p>
                <p>✉️ <strong className="text-[#1A1A1A] font-medium">Email:</strong> adorous.fashion@gmail.com</p>
              </div>
            </section>

            {/* Outro */}
            <section className="pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                By shopping at <strong className="text-[#1A1A1A]">Adorous</strong>, you acknowledge and agree to the terms and conditions outlined in this Exchange Policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}