import "./globals.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-[#090807] text-stone-100 font-sans">
      {children}
    </div>
  );
}
