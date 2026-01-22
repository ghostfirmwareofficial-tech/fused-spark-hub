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
  { name: 'Home', path: '/', icon: Home },
  { name: 'Feed', path: '/feed', icon: Users },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Shop', path: '/shop', icon: ShoppingBag },
  { name: 'Apply', path: '/apply', icon: FileText },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { data: profile } = useProfile();
  const { isAdmin } = useUserRole();

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
              {!loading && user && profile ? (
                <>
                  {/* Admin Panel Button */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Admin</span>
                    </Link>
                  )}

                  {/* Points Display */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm text-yellow-400">
                      {profile.fused_points?.toLocaleString() || 0}
                    </span>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-fused-purple/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 overflow-hidden">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-fused-purple" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{profile.ign}</span>
                  </Link>

                  {/* Sign Out */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : !loading ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    onClick={() => openAuthModal('login')}
                  >
                    Log In
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => openAuthModal('signup')}
                  >
                    Join Now
                  </Button>
                </div>
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
              className="md:hidden bg-background/80 backdrop-blur-xl border-t border-white/10 rounded-b-2xl"
            >
              <div className="px-4 py-4 space-y-2">
                {user && profile && (
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 overflow-hidden">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-fused-purple" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{profile.ign}</p>
                        <p className="text-xs text-fused-purple">{profile.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
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
                        ? "bg-fused-purple/20 text-fused-purple border border-fused-purple/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
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
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10"
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
                      variant="glass"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="default"
                      className="w-full"
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
