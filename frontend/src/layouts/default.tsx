import { Navbar } from "@/components/Navbar/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        <div className="h-full gap-10 grid grid-cols-1 md:grid-cols-[minmax(220px,0.2fr)_1fr]">
          <aside className="hidden md:block h-full">
            <Sidebar />
          </aside>

          <main className="h-full overflow-auto">{children}</main>
        </div>
      </main>
      {/* <footer className="w-full flex items-center justify-center py-3"> */}
      {/*   <Link */}
      {/*     isExternal */}
      {/*     className="flex items-center gap-1 text-current" */}
      {/*     href="https://heroui.com" */}
      {/*     title="heroui.com homepage" */}
      {/*   > */}
      {/*     <span className="text-default-600">Powered by</span> */}
      {/*     <p className="text-primary">HeroUI</p> */}
      {/*   </Link> */}
      {/* </footer> */}
    </div>
  );
}
