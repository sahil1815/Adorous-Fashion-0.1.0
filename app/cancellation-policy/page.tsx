import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Cancellation Policy | Adorous",
  description: "Read about order cancellations, flexibility, and processing at Adorous.",
};

export default function CancellationPolicyPage() {
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
            Cancellation Policy
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            At <strong className="text-[#1A1A1A]">Adorous</strong>, we understand that plans can change. Our cancellation policy is designed to offer flexibility while ensuring smooth order processing.
          </p>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                1. Customer-Initiated Cancellations
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Orders can be canceled before shipment, within <strong className="text-[#1A1A1A]">1 hour</strong> of placing the order.</li>
                <li>To cancel an order, please contact our Customer Support team via phone or email and provide your Order ID.</li>
                <li>Once an order has been dispatched, it cannot be canceled. However, you may request a return or exchange according to our Return & Exchange Policies.</li>
                <li>If your order includes multiple items, you may cancel one or more items before shipment. Refunds or payment adjustments will be processed accordingly.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                2. Adorous-Initiated Cancellations
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                We reserve the right to cancel orders under the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>The product is out of stock.</li>
                <li>There is a pricing, listing, or technical error.</li>
                <li>The delivery address provided is invalid or unreachable.</li>
                <li>The customer is unresponsive during verification or confirmation calls.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                3. Contact Us
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                For any cancellation-related queries or assistance, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 <strong className="text-[#1A1A1A] font-medium">Phone:</strong> +8801700625482</p>
                <p>✉️ <strong className="text-[#1A1A1A] font-medium">Email:</strong> adorous.fashion@gmail.com</p>
              </div>
            </section>

            {/* Outro */}
            <section className="pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                By placing an order with <strong className="text-[#1A1A1A]">Adorous</strong>, you acknowledge and agree to the terms and conditions outlined in this Cancellation Policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}