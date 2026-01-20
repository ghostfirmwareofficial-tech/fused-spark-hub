import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  MessageSquare,
  ShoppingBag,
  FileText,
  User,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Feed', path: '/feed', icon: Users },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Apply', path: '/apply', icon: FileText },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock user for now - will integrate with auth later
  const isAuthenticated = false;
  const userProfile = null;

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl border border-fused-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/fused-logo.png"
              alt="Fused Up"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl tracking-tight glow-text">FUSED UP</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl rounded-xl p-1 border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-fused-purple/30 text-fused-purple border border-fused-purple/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && userProfile ? (
              <>
                {/* Points Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm">0</span>
                </div>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-fused-purple/30 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50">
                    <User className="w-4 h-4 text-fused-purple" />
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Log In
                </Button>
                <Button variant="default">
                  Join Now
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-xl border-t border-white/10 rounded-b-2xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    location.pathname === item.path
                      ? "bg-fused-purple/20 text-fused-purple border border-fused-purple/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              <Button
                variant="default"
                className="w-full mt-4"
              >
                Join Fused Up
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
