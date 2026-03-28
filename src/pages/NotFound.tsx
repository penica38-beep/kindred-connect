import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <img src="/favicon.png" alt="চোর কই" className="w-16 h-16 mx-auto mb-4 rounded-2xl" />
        <h1 className="text-6xl font-bold font-display text-primary mb-2">404</h1>
        <p className="text-lg text-muted-foreground font-display mb-6">পৃষ্ঠাটি পাওয়া যায়নি</p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" /> হোমে যান
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> পেছনে যান
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
