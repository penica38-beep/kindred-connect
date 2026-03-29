import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Map, ListFilter, PlusCircle, Info } from "lucide-react";
import { useInstallPWA } from "@/hooks/useInstallPWA";

const navItems = [
  { to: "/", icon: Map, label: "ম্যাপ" },
  { to: "/feed", icon: ListFilter, label: "ফিড" },
  { to: "/add-report", icon: PlusCircle, label: "রিপোর্ট" },
  { to: "/info", icon: Info, label: "তথ্য" },
];

export function TopNav() {
  const { canInstall, install } = useInstallPWA();

  return (
    <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 shadow-lg z-50 sticky top-0">
      <div className="flex items-center gap-2.5 flex-1">
        <img src="/logo.jpg" alt="চোর কই" className="h-8 w-8 object-cover" />
        <h1 className="font-display font-bold text-lg tracking-tight">চোর কই</h1>
      </div>
      {canInstall && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 transition-colors text-sm font-medium backdrop-blur-sm"
        >
          <span className="font-display">Install</span>
        </button>
      )}
    </header>
  );
}

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t z-50 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 text-xs transition-all ${
                isActive ? "text-primary font-semibold scale-105" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "drop-shadow-sm" : ""}`} />
              <span className="font-display">{item.label}</span>
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-card border-r fixed top-14 bottom-0 z-40">
      <nav className="flex flex-col gap-1 p-3 pt-4">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-display">{item.label}</span>
            </RouterNavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <div className="flex flex-1">
        <DesktopSidebar />
        <main className="flex-1 pb-16 md:pb-0 md:ml-56">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
