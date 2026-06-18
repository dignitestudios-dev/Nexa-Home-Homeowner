import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-8 flex items-center justify-between border-b pb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#181818]">Terms &amp; Conditions</h1>
          <Link href="/login" className="flex items-center gap-2 text-[#005864] hover:text-[#004750] transition-colors font-medium">
            <ArrowLeft size={20} />
            Back to Login
          </Link>
        </div>

        <div className="prose prose-p:text-[#18181899] prose-headings:text-[#181818] max-w-none space-y-6">
          <p className="text-lg">Last updated: June 18, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using the NexaHome platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. User Accounts</h2>
            <p className="leading-relaxed">
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Service Provision</h2>
            <p className="leading-relaxed">
              NexaHome acts as a platform to connect homeowners with service professionals. We do not guarantee the quality, safety, or legality of the services provided by professionals on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Communications</h2>
            <p className="leading-relaxed">
              By creating an Account on our service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <p className="text-sm mt-12 text-[#18181880]">
            For any questions regarding these terms, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
