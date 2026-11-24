import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BarChart3,
  Bell,
  ChevronDown,
  Command,
  LayoutDashboard,
  Loader2,
  LogOut,
  RotateCcw,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await authApi.resetDemo();
      await queryClient.invalidateQueries();
      toast.success('Demo data restored to default sample applications');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset demo data');
    } finally {
      setIsResetting(false);
    }
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="Logo" className="w-10 h-10" />
              <span className="font-bold text-xl tracking-tight">
                Log<span className="text-primary">My</span>Jobs
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.isDemo && (
              <div className="hidden sm:flex items-center gap-1.5 mr-1">
                <Badge variant="default" className="gap-1 py-1">
                  <Sparkles className="w-3 h-3" />
                  Demo
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDemo}
                  disabled={isResetting}
                  className="h-7 px-2.5 text-xs"
                  title="Restore sample demo applications"
                >
                  {isResetting ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <RotateCcw className="w-3 h-3 mr-1" />
                  )}
                  Reset
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={openCommandPalette}
              className="hidden lg:inline-flex items-center gap-2 h-8 px-2.5 text-xs text-muted-foreground"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Quick Jump</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-secondary-foreground">
                Ctrl K
              </kbd>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline text-foreground">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 glass border-border">
                {user?.isDemo && (
                  <>
                    <DropdownMenuItem
                      onClick={handleResetDemo}
                      disabled={isResetting}
                      className="cursor-pointer sm:hidden"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Demo Data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="sm:hidden" />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/analytics')}
                  className="cursor-pointer md:hidden"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/reminders')}
                  className="cursor-pointer md:hidden"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Reminders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
