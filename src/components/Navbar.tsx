import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
	Briefcase,
	LogOut,
	User,
	LayoutDashboard,
	BarChart3,
	Bell,
	Settings,
	ChevronDown,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const navLinks = [
		{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ to: "/analytics", label: "Analytics", icon: BarChart3 },
		{ to: "/reminders", label: "Reminders", icon: Bell },
	];

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-8">
						<Link to="/dashboard" className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
								<img src="/logo-icon.svg" alt="Logo" className="w-10 h-10" />
							</div>
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
										"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
										location.pathname === link.to
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
									)}
								>
									<link.icon className="w-4 h-4" />
									{link.label}
								</Link>
							))}
						</div>
					</div>

					<div className="flex items-center gap-2">
						<ThemeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-2 px-3"
								>
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
										<User className="w-4 h-4" />
									</div>
									<span className="hidden sm:inline text-foreground">
										{user?.name}
									</span>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-48 glass border-border"
							>
								<DropdownMenuItem
									onClick={() => navigate("/profile")}
									className="cursor-pointer"
								>
									<Settings className="w-4 h-4 mr-2" />
									Profile Settings
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate("/reminders")}
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
