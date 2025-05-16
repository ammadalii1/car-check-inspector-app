
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem("userEmail") || "User";

  // Authentication check has been removed

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold">Car Inspection App</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {userEmail}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
        <nav className="container mx-auto px-4 py-2 border-t">
          <ul className="flex space-x-4">
            <li>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/new-inspection" 
                className={`text-sm font-medium ${location.pathname.startsWith('/new-inspection') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                New Inspection
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
