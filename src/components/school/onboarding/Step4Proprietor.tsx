import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { inviteProprietor } from "@/src/lib/api/schools";

type Props = {
  name: string;
  email: string;
  phone: string;
  invited: boolean;
  onChange: (partial: {
    proprietorName?: string;
    proprietorEmail?: string;
    proprietorPhone?: string;
  }) => void;
  onInvited: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step4Proprietor({
  name,
  email,
  phone,
  invited,
  onChange,
  onInvited,
  onNext,
  onBack,
}: Props) {
  const [sending, setSending] = useState(false);
  const canSend = name.trim() && email.trim() && phone.trim();

  async function handleSend() {
    setSending(true);
    await inviteProprietor({ name, email, phone });
    setSending(false);
    onInvited();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-dark-blue">
          Invite proprietor
        </h2>
        <p className="mt-1 text-sm text-grey-text">
          The proprietor (owner) will receive an email to set up their account.
        </p>
      </div>

      {invited ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" />
          <div>
            <p className="text-sm font-medium text-dark-blue">
              Invitation sent to {name}
            </p>
            <p className="text-xs text-grey-text">
              They&apos;ll receive an email at {email}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Full name
            </label>
            <input
              type="text"
              placeholder="Mrs. Grace Okafor"
              value={name}
              onChange={(e) => onChange({ proprietorName: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Email address
            </label>
            <input
              type="email"
              placeholder="grace@school.com"
              value={email}
              onChange={(e) => onChange({ proprietorEmail: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Phone number
            </label>
            <input
              type="tel"
              placeholder="+234 801 234 5678"
              value={phone}
              onChange={(e) => onChange({ proprietorPhone: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend || sending}
            className="w-full rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {sending ? "Sending…" : "Send Invitation"}
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border-default px-6 py-3 text-sm text-dark-blue hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90"
        >
          {invited ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
