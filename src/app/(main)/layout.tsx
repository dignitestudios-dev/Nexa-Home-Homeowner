import Navbar from "./_components/ui/navbar"


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-5 max-w-screen-2xl w-full mx-auto ">
        <Navbar />
        <div className="bg-[#0058640F] -mt-10 pt-14" >
      {children}
      </div>
    </div>
  );
}
