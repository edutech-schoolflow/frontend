import AuthCardLayout from "@/src/layout/auth/AuthCardLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthCardLayout
      title="Login"
      subTitle="Enter your account details below to login to the portal."
    >
      {children}
    </AuthCardLayout>
  );
}
