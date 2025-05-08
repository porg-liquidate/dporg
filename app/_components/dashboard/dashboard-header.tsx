'use client'
import Image from "next/image";
import logo from "@/public/images/lightlogo.png";
import ActionButton from "@/components/ActionButton";

export function DashboardHeader() {
  return (
    <header className="bg-black sticky top-0 z-50 w-full border-b border-secondary/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="rounded-md"
            />
          </a>
      </div>
        <div className="flex items-center gap-4">
          <appkit-button />
        </div>
      </div>
    </header>
  );
}
