import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="w-full pt-16 md:pt-20 px-4 max-w-7xl 2xl:max-w-screen-xl mx-auto">
        <div className="flex gap-x-7">
          <div className="w-64 shrink-0 hidden md:block">
            <Sidebar />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
