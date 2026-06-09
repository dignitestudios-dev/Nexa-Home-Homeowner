"use client"
import { useFcmNotification } from "@/hooks/use-fcm-notification";
import Navbar from "./_components/ui/navbar"


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFcmNotification()
  return (
    <div className="p-5 max-w-screen-2xl w-full mx-auto ">
      <Navbar />
      <div className="bg-[#0058640F] min-h-screen -mt-10 pt-14" >
        {children}
      </div>
    </div>
  );
}
