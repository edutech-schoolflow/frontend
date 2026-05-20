import Link from "next/link";
import { AuthCardLayoutProps } from "@/src/types/auth";

const AuthCardLayout = ({ children, title, subTitle }: AuthCardLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="text-xl font-bold text-brand-green tracking-tight">
          SchoolFlow
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-heading tracking-[-0.26px]">
          {title}
        </h1>
        {subTitle && (
          <p className="mt-1 text-sm font-normal text-text-body tracking-[-0.15px] leading-5">
            {subTitle}
          </p>
        )}
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-[15px] bg-white p-9.5 shadow-[5px_4px_35px_0_rgba(0,0,0,0.03)]">
        {children}
      </div>
    </div>
  );
};

export default AuthCardLayout;
