import AuthCardLayout from "@/src/layout/auth/AuthCardLayout";

export default function KycPage() {
  return (
    <AuthCardLayout
      title="KYC Verification"
      subTitle="Complete identity verification to activate payments and become visible to parents"
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-medium text-amber-700">⚠️ Verification Required</p>
          <p className="text-xs text-amber-600 mt-1">
            Your school cannot receive payments or appear in parent search results until KYC is approved.
            This typically takes 2–3 business days.
          </p>
        </div>

        <div className="space-y-2 text-sm text-grey-text">
          <p className="font-medium text-dark-blue">You will need:</p>
          <ul className="space-y-1 list-none">
            {[
              "School registration certificate",
              "Operating licence / permit",
              "Proof of address (utility bill)",
              "Proprietor's government-issued ID (front & back)",
              "School bank account details",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-brand-green">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:bg-brand-green/90">
          Start KYC Verification
        </button>

        <button className="w-full rounded-lg border border-gray-200 py-3 text-sm text-grey-text hover:bg-gray-50">
          Do This Later — Go to Dashboard
        </button>
      </div>
    </AuthCardLayout>
  );
}
