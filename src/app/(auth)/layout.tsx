import LeftSidebar from "./_components/ui/left-sidebar";


export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
        <LeftSidebar />
      {children}
    </div>
  );
}
