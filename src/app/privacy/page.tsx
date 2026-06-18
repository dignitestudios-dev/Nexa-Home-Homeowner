import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-8 flex items-center justify-between border-b pb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#181818]">Privacy Policy</h1>
          <Link href="/login" className="flex items-center gap-2 text-[#005864] hover:text-[#004750] transition-colors font-medium">
            <ArrowLeft size={20} />
            Back to Login
          </Link>
        </div>

        <div className="prose prose-p:text-[#18181899] prose-headings:text-[#181818] max-w-none space-y-6">
          <p className="text-lg">Last updated: June 18, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information that you provide directly to us when you create an account, update your profile, use the interactive features of our Services, or otherwise communicate with us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to provide, maintain, and improve our Services, such as to process transactions, send notifications, and personalize your experience on the NexaHome platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Sharing of Information</h2>
            <p className="leading-relaxed">
              We may share your information with service professionals when you request a service, in order to facilitate the connection and provide the service you requested. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
            <p className="leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@nexahome.com.
            </p>
          </section>

          <p className="text-sm mt-12 text-[#18181880]">
            By using NexaHome, you consent to our collection and use of your information as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
