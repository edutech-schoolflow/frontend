import Link from "next/link";
import Logo from "@/src/components/ui/Logo";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function TeacherAuthLayout({
  children,
  title,
  subtitle,
}: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex w-full max-w-[520px] items-center justify-between">
          <Link href="/staff">
            <Logo size={28} />
          </Link>
          <Link
            href="/staff"
            className="text-[13px] text-text-body transition-colors hover:text-text-heading"
          >
            ← Back
          </Link>
        </div>

        <div className="w-full max-w-[520px] rounded-2xl bg-white px-8 py-8 shadow-[0_4px_40px_rgba(0,0,0,0.10)]">
          <div className="mb-7">
            <h1 className="text-[26px] font-semibold tracking-tight text-text-heading">
              {title}
            </h1>
            <p className="mt-1.5 text-[14px] text-text-body">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
