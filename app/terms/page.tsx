import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Adorous",
  description:
    "Read the Terms and Conditions for using the Adorous website and services.",
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
        </div>

        {/* The Main White Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <p className="text-sm font-bold text-[#1A1A1A] mb-6">
            Last Updated: 18 April 2026
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Welcome to <strong className="text-[#1A1A1A]">Adorous</strong>!
            These Terms and Conditions govern your access to and use of the
            Adorous website, mobile application, and related services
            (collectively referred to as the "Service"). By accessing or using
            our Service, you agree to comply with and be bound by these Terms.
            If you do not agree, please discontinue use immediately.
          </p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                1. User Accounts and Registration
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                To access certain features of the Service, users may be required
                to create an account. You are responsible for maintaining the
                confidentiality of your login credentials and for all activities
                that occur under your account. You must provide accurate,
                complete, and up-to-date information during registration.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                2. User Conduct
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                By using Adorous, you agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Violate any applicable laws or regulations.</li>
                <li>Infringe upon the rights of others.</li>
                <li>
                  Upload, post, or transmit harmful, abusive, or inappropriate
                  content.
                </li>
                <li>
                  Engage in fraudulent, misleading, or unauthorized activities.
                </li>
                <li>Use the platform for unlawful or prohibited purposes.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                3. Intellectual Property
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                All content, trademarks, graphics, logos, designs, and
                functionalities available on the Service are the exclusive
                property of <strong className="text-[#1A1A1A]">Adorous</strong>{" "}
                and protected by applicable intellectual property laws.
                Unauthorized use, reproduction, or distribution is strictly
                prohibited.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                4. Product Listings and Transactions
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adorous strives to ensure the highest accuracy of product
                listings, pricing, and descriptions. Buyers are responsible for
                reviewing product details before making a purchase. We reserve
                the right to correct any errors, inaccuracies, or omissions at
                any time without prior notice.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                5. Payment and Transactions
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Payments are securely processed through trusted payment
                partners. Users must provide accurate billing and payment
                information. Adorous reserves the right to refuse or cancel any
                transaction in cases of suspected fraud, pricing errors, or
                unauthorized activity.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                6. Privacy Policy
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                By using our Service, you agree to our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#B76E79] hover:underline"
                >
                  Privacy Policy
                </Link>
                , which describes how Adorous collects, uses, and protects your
                personal data. Please review it for full details.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                7. Returns, Exchanges, and Refunds
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                All returns, exchanges, and refunds are handled according to
                Adorous's official{" "}
                <Link
                  href="/return-policy"
                  className="text-[#B76E79] hover:underline"
                >
                  Return & Refund Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/exchange-policy"
                  className="text-[#B76E79] hover:underline"
                >
                  Exchange Policy
                </Link>
                . Users are advised to review these policies before placing
                orders.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                8. Termination
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adorous reserves the right to suspend or terminate user accounts
                and access to the Service without notice if any violation of
                these Terms, fraudulent activity, or misuse of the platform is
                detected.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                9. Updates to Terms
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adorous may update or revise these Terms at any time. Updated
                versions will be posted on this page, and continued use of the
                Service constitutes acceptance of the revised Terms. Users are
                encouraged to check this page regularly.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                10. Limitation of Liability
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adorous, its affiliates, employees, and partners shall not be
                held liable for any direct, indirect, incidental, or
                consequential damages resulting from the use or inability to use
                the Service, including product issues, delivery delays, or
                technical errors.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                11. Governing Law
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                These Terms and Conditions are governed by and construed in
                accordance with the laws of Bangladesh. Any disputes shall be
                subject to the exclusive jurisdiction of the courts of
                Bangladesh.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#B76E79] mb-3">
                12. Contact Us
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                For any questions or concerns regarding these Terms and
                Conditions, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p>
                  📞{" "}
                  <strong className="text-[#1A1A1A] font-medium">Phone:</strong>{" "}
                  +8801700625482
                </p>
                <p>
                  ✉️{" "}
                  <strong className="text-[#1A1A1A] font-medium">Email:</strong>{" "}
                  adorous.fashion@gmail.com
                </p>
              </div>
            </section>

            {/* Outro */}
            <section className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                By using <strong className="text-[#1A1A1A]">Adorous</strong>,
                you acknowledge that you have read, understood, and agreed to
                these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
