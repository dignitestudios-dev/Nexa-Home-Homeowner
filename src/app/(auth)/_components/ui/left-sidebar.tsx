import Image from "next/image";
import React from "react";

type Props = {};

const LeftSidebar = (props: Props) => {
  return (
    <div className="w-1/2 bg-[#005864] relative  hidden lg:flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative circle background */}
      <div
        className="absolute w-full h-full rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(215,223,35,0.21) 0%, rgba(0,88,100,0.21) 100%)",
        }}
      ></div>

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <Image
          src="/images/sidebar-logo.png"
          alt="NexaHome Logo"
          width={300}
          height={300}
          priority
        />
      
      </div>
      <Image   src="/images/ellispe.png"
          alt="NexaHome Logo"
        fill
        className="mt-44"
          priority />
    </div>
  );
};

export default LeftSidebar;
