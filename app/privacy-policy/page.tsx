import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Adorous",
  description: "Read about how Adorous collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            <strong className="text-[#1A1A1A]">Adorous</strong> understands that our users care about their personal data and how it is collected, used, shared, protected, and cared for. We are committed to handling your personal data in accordance with applicable laws when you use any features and functions on our Platform or Services, interact with us, or access our Services through your computer or mobile device.
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-8 leading-relaxed">
            PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY CLICKING "SIGN UP", "LOGIN", OR CONTINUING TO USE THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY AND CONSENT TO THE COLLECTION, USE, DISCLOSURE, STORAGE, TRANSFER AND/OR PROCESSING OF YOUR PERSONAL DATA AS DESCRIBED HEREIN.
          </p>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                1. Introduction To This Privacy Policy
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>1.1</strong> Data protection is a matter of trust and your privacy is important to us. This Privacy Policy explains how Adorous ("we", "our", "us") collects, uses, shares, and protects information in connection with our Services.</li>
                <li><strong>1.2</strong> When you use Adorous's applications and websites, we may collect, use, disclose, store and/or process data, including your personal data, in accordance with this policy.</li>
                <li><strong>1.3</strong> We may update this Privacy Policy from time to time due to legal, technical, or business developments. Your continued use of the Platform constitutes your acknowledgment and acceptance of the changes.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                2. The Personal Data We Collect
              </h2>
              <p className="text-sm text-gray-600 mb-2"><strong>2.1</strong> Depending on your use of our Platform, the personal data you may provide includes:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
                <li><strong>Identity and Profile Data:</strong> name, email address, phone number, and password.</li>
                <li><strong>Account and Transaction Data:</strong> delivery/billing address, payments and orders, and details of products you buy.</li>
                <li><strong>Usage Data:</strong> information about how and when you use the Platform.</li>
                <li><strong>Marketing and Communications Data:</strong> marketing preferences, feedback, and your chat/email history with our service providers.</li>
              </ul>
              <p className="text-sm text-gray-600 mb-2"><strong>2.2</strong> How We Receive Your Personal Data:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>When you browse our sites or create an account;</li>
                <li>When you make a transaction for products;</li>
                <li>When you subscribe to publications or marketing;</li>
                <li>When you interact with our customer service.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                3. Use and Disclosure of Your Personal Data
              </h2>
              <p className="text-sm text-gray-600 mb-2"><strong>3.1</strong> We use/disclose personal data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><strong>Processing Your Orders:</strong> to process orders you submit, deliver products you purchase (sharing necessary data with logistics partners), and process payments.</li>
                <li><strong>Providing Services:</strong> to administer your account and respond to queries or feedback.</li>
                <li><strong>Marketing:</strong> to provide information we think you may find useful or conduct marketing/advertising.</li>
                <li><strong>Legal and Operational:</strong> to ascertain your identity for fraud detection, comply with legal requirements, and protect the safety of Adorous and its users.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                4. Withdrawal of Consent
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                You may withdraw consent for our continued use/disclosure of your personal data by contacting us. If you withdraw consent, we may be unable to continue providing some Services to you. You may unsubscribe from marketing at any time via the unsubscribe link in marketing emails.
              </p>
            </section>

            {/* Section 5 & 6 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                5 & 6. Updating, Accessing, and Correcting Data
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your personal data must be accurate and complete for you to continue using the Platform. You can update your personal data anytime via your account settings. You may also request information about your personal data that we hold or request corrections by contacting us.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                7. Security of Your Personal Data
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                To safeguard your personal data, we implement physical, administrative, and technical measures, including industry-standard encryption (e.g., TLS) when processing financial details. However, no method of Internet transmission is completely secure.
              </p>
            </section>

            {/* Section 8 & 9 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                8 & 9. Retention of Data & Minors
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                We retain personal data only as long as required by law or as relevant for the purposes for which it was collected. 
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adorous does not sell products to minors. We do not knowingly collect personal data relating to minors. You confirm that you are above the age of majority and can understand and accept this Privacy Policy.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                10. Third Party Sites
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                The Platform may contain links to other websites operated by other parties. We are not responsible for the privacy practices of websites operated by these other parties. You access them at your own risk.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                11. Questions, Feedback, Concerns, or Complaints
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                For questions or concerns about our privacy practices or to exercise your rights, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p>✉️ <strong className="text-[#1A1A1A] font-medium">Email:</strong> adorous.fashion@gmail.com</p>
                <p>📞 <strong className="text-[#1A1A1A] font-medium">Phone:</strong> +8801700625482</p>
                <p>🏢 <strong className="text-[#1A1A1A] font-medium">Address:</strong> Adorous Fashion, Rajshahi, Bangladesh</p>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3 uppercase">
                12. Country Specific Rider
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Bangladesh:</strong> This Privacy Policy applies to all processing of personal data that takes place wholly or partly in Bangladesh. Adorous complies with applicable Bangladeshi laws and regulations on data protection and e-commerce.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}