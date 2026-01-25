import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Redirect to fallback domain
    window.location.href = "https://fusedup.org/";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-lg text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default NotFound;
