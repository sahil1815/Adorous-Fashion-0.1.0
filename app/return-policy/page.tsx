import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | Adorous",
  description: "Read about the return, refund, and cancellation policies at Adorous.",
};

export default function ReturnPolicyPage() {
  return (
    // The background matches your Account and Forgot Password pages
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
            Return & Refund Policy
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Thank you for shopping with <strong className="text-[#1A1A1A]">Adorous</strong>. We truly appreciate your trust and are committed to providing you with a smooth and satisfying shopping experience. Please read this policy carefully to understand your rights and responsibilities regarding returns and refunds.
          </p>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                1. Eligibility for Returns and Refunds
              </h2>
              <p className="text-sm text-gray-600 mb-3">To qualify for a return or refund:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>When receiving the delivery, customers must check the product in front of the delivery person.</li>
                <li>If the product is damaged, defective, or incorrect, customers must inform the delivery person immediately and decline to accept the item.</li>
                <li>Once the product is accepted and the delivery agent has left, no return or refund requests will be accepted.</li>
                <li>The returned item must remain unused, undamaged, and in its original packaging.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                2. Refund Timeline
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Approved refunds are typically processed within 7–10 working days. Refunds will be issued to the original payment method used during purchase.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                3. Order Cancellation
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders can be canceled within <strong className="text-[#1A1A1A]">1 hour</strong> of placement. After 1 hour, the order may already be in processing or shipment, and cancellation may not be possible.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                4. Contact Us
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                If you have any questions about our Return & Refund Policy or need assistance, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 <strong className="text-[#1A1A1A] font-medium">Phone:</strong> +8801700625482</p>
                <p>✉️ <strong className="text-[#1A1A1A] font-medium">Email:</strong> adorous.fashion@gmail.com</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                5. Policy Updates
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                This policy is subject to change without prior notice. We encourage you to review this page periodically to stay updated.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                By shopping at <strong className="text-[#1A1A1A]">Adorous</strong>, you acknowledge and agree to the terms and conditions outlined in this Return & Refund Policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}