import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Menu,
  X,
  Zap,
  LogOut,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserRole } from '@/hooks/useUserRole';
import AuthModal from '@/components/auth/AuthModal';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Feed', path: '/feed' },
  { name: 'Tournaments', path: '/tournaments' },
  { name: 'Chat', path: '/chat' },
  { name: 'Shop', path: '/shop' },
  { name: 'Apply', path: '/apply' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { data: profile } = useProfile();
  const { isAdmin } = useUserRole();

  const updateIndicator = useCallback(() => {
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeIndex !== -1 && navRefs.current[activeIndex] && navContainerRef.current) {
      const activeEl = navRefs.current[activeIndex];
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const activeRect = activeEl!.getBoundingClientRect();
      
      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="glass-container p-4 glass-card-hover">
          <div className="flex items-center justify-between">
            {/* Logo - Mobile only */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <img 
                src="/images/fused-logo.png"
                alt="Fused Up"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-lg">FUSED UP</span>
            </Link>

            {/* Pill Navigation - Desktop */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div ref={navContainerRef} className="pill-nav relative">
                {/* Animated sliding indicator that fits content */}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-primary via-fused-blue to-fused-violet shadow-lg shadow-primary/25"
                  initial={false}
                  animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
                
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    ref={(el) => { navRefs.current[index] = el; }}
                    to={item.path}
                    className={cn(
                      "pill-nav-item relative z-10 whitespace-nowrap",
                      location.pathname === item.path
                        ? "text-primary-foreground"
                        : "pill-nav-item-inactive"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-3">
              {!loading && user && profile ? (
                <>
                  {/* Admin Panel Button */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Admin</span>
                    </Link>
                  )}

                  {/* Points Display */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm text-yellow-400">
                      {profile.fused_points?.toLocaleString() || 0}
                    </span>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{profile.ign}</span>
                  </Link>

                  {/* Sign Out */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground rounded-full"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : !loading ? (
                <Button
                  onClick={() => openAuthModal('signup')}
                  className="rounded-full px-6 bg-transparent border border-white/20 hover:bg-white/5"
                >
                  Contact Us
                </Button>
              ) : null}
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
              className="md:hidden mt-2 glass-container overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {user && profile && (
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{profile.ign}</p>
                        <p className="text-xs text-primary">{profile.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-sm text-yellow-400">
                        {profile.fused_points?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      location.pathname === item.path
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                      >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="pt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                    >
                      Log In
                    </Button>
                    <Button
                      className="w-full rounded-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signup');
                      }}
                    >
                      Join Fused Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}