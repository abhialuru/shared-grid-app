"use client";
import { useEffect, useState } from "react";

export default function DesktopOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null); // ← null, not false

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isDesktop === null) return null; // ← render nothing while checking

  if (!isDesktop) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4 px-6 text-center bg-white">
        <span className="text-4xl">🖥️</span>
        <h1 className="text-lg font-bold text-gray-800">Desktop Only</h1>
        <p className="text-sm text-gray-500">
          This Game is optimized for desktop. Please open it on a larger screen.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
