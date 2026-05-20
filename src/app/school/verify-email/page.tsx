import AuthCardLayout from "@/src/layout/auth/AuthCardLayout";

export default function VerifyEmailPage() {
  return (
    <AuthCardLayout
      title="Check Your Email"
      subTitle="We've sent a verification link to your inbox"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
          ✉️
        </div>

        <div className="space-y-1">
          <p className="text-sm text-dark-blue font-medium">
            Verification email sent
          </p>
          <p className="text-xs text-grey-text max-w-xs">
            Click the link in the email to activate your Greenfield Academy
            account. The link expires in 24 hours.
          </p>
        </div>

        <div className="w-full rounded-lg bg-gray-50 border border-border-default p-4 text-left text-xs text-grey-text space-y-1">
          <p>• Check your spam or junk folder if you don&apos;t see it</p>
          <p>• Make sure you entered the correct email address</p>
        </div>

        <button className="text-sm text-brand-green font-medium hover:underline">
          Resend Verification Email
        </button>
      </div>
    </AuthCardLayout>
  );
}
