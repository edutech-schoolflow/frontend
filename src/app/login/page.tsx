import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Welcome to My Kedco Admin",
};

const Login = dynamic(() => import("@/src/components/auth"));

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
