"use client";

import { Loader as Spinner } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-fade-primary">
      <Spinner className="mr-2 h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
