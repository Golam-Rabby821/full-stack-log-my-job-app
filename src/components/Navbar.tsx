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
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getInitial = (name?: string) => (name?.trim()?.[0] || 'U').toUpperCase();

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
    { to: '/dashboard', label: 'Pipeline', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" aria-label="LogMyJobs Pipeline">
              <BrandMark />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    )}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.isDemo && (
              <div className="hidden sm:flex items-center gap-1.5 mr-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-xs font-medium text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Demo
                </span>
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
              <Command className="w-3 h-3" />
              <span>Jump</span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded bg-secondary text-secondary-foreground border border-border">
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 h-8">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border text-foreground font-mono text-xs font-medium">
                    {getInitial(user?.name)}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-foreground max-w-[140px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-popover border-border shadow-md">
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
