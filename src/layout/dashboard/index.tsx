"use client";

import Navbar from "./navbar";
import Sidebar from "./sidebar/sidebar";
import { ReactNode } from "react";

const LayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <Sidebar />
      <div className="ml-70 flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default LayoutPage;
