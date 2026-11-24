import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const runAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or jump to a page..." />
      <CommandList>
        <CommandEmpty>No matching commands found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runAction(() => navigate('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => navigate('/analytics'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => navigate('/reminders'))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Reminders</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => navigate('/profile'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runAction(() => setTheme('light'))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Switch to Light Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => setTheme('dark'))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Switch to Dark Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => setTheme('system'))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Use System Theme</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() =>
              runAction(() => {
                logout();
                navigate('/login');
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Log Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
