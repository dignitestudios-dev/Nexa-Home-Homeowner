"use client"
import { useDisableBfcache } from "@/hooks/use-disbable-bfcache";
import LeftSidebar from "./_components/ui/left-sidebar";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useDisableBfcache()
  return (
    <div className="flex">
      <LeftSidebar />
      {children}
    </div>
  );
}
