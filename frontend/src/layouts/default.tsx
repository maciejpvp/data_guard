import { Navbar } from "@/components/Navbar/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16 mb-10">
        <div className="h-full gap-10 grid grid-cols-1 md:grid-cols-[minmax(220px,0.2fr)_1fr]">
          <aside className="hidden md:block h-full">
            <Sidebar />
          </aside>

          <main className="p-4 max-h-full">{children}</main>
        </div>
      </main>
    </div>
  );
}
