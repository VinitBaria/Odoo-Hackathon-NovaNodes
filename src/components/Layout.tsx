import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, User, ShoppingBag, Plus, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-primary sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-white" />
            <span className="text-3xl font-extrabold text-white tracking-tight">ReWear</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/browse" 
              className={`text-white hover:text-green-200 transition-colors ${isActive('/browse') ? 'text-green-200' : ''}`}
            >
              Browse Items
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-white hover:text-green-200 transition-colors ${isActive('/dashboard') ? 'text-green-200' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/add-item" 
                  className={`text-white hover:text-green-200 transition-colors ${isActive('/add-item') ? 'text-green-200' : ''}`}
                >
                  Add Item
                </Link>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-white hover:text-green-200 transition-colors ${isActive('/admin') ? 'text-green-200' : ''}`}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Points: {user.points}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="text-white hover:text-green-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="eco" size="sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Points: {user.points}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-white hover:text-green-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="eco" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6" />
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-green-100">
                Sustainable fashion exchange platform promoting circular economy and reducing textile waste.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-green-100">
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse Items</Link></li>
                <li><Link to="/add-item" className="hover:text-white transition-colors">List an Item</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-green-100">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-green-100">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/safety" className="hover:text-white transition-colors">Safety & Trust</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-8 text-center text-green-100">
            <p>&copy; 2024 ReWear. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}