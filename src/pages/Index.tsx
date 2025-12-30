import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Briefcase, ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";

const features = [
	{
		icon: Briefcase,
		title: "Track Applications",
		description: "Keep all your job applications organized in one place",
	},
	{
		icon: Shield,
		title: "Secure & Private",
		description: "Your data is protected with industry-standard encryption",
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description: "Add, update, and manage jobs in seconds",
	},
];

const Index = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, isLoading, navigate]);

	return (
		<div className="min-h-screen flex flex-col relative overflow-hidden">
			{/* Background effects */}
			<div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

			{/* Navbar */}
			<nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
				<div className="flex items-center gap-3">
					<img src="/logo-icon.svg" alt="Logo" className="w-12 h-12" />
					<span className="font-bold text-xl tracking-tight">
						Log<span className="text-primary">My</span>Jobs
					</span>
				</div>
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Link to="/login">
						<Button variant="ghost">Sign In</Button>
					</Link>
					<Link to="/register">
						<Button variant="glow">Get Started</Button>
					</Link>
				</div>
			</nav>

			{/* Hero */}
			<main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
				<div className="max-w-3xl mx-auto animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
						<CheckCircle2 className="w-4 h-4" />
						Your job search, simplified
					</div>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
						Track your job applications{" "}
						<span className="gradient-text">effortlessly</span>
					</h1>

					<p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
						Stay organized, never miss a follow-up, and land your dream job with
						LogMyJobs – the modern way to manage your career journey.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link to="/register">
							<Button variant="glow" size="xl">
								Start Tracking Free
								<ArrowRight className="w-5 h-5" />
							</Button>
						</Link>
						<Link to="/login">
							<Button variant="outline" size="xl">
								Sign In
							</Button>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className="grid sm:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto w-full">
					{features.map((feature, index) => (
						<div
							key={feature.title}
							className="glass rounded-2xl p-6 text-left animate-fade-in"
							style={{ animationDelay: `${0.2 + index * 0.1}s` }}
						>
							<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
								<feature.icon className="w-6 h-6" />
							</div>
							<h3 className="font-semibold text-foreground mb-2">
								{feature.title}
							</h3>
							<p className="text-sm text-muted-foreground">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</main>

			{/* Footer */}
			<footer className="relative z-10 text-center py-6 text-sm text-muted-foreground">
				© {new Date().getFullYear()} LogMyJobs. Built with passion.
			</footer>
		</div>
	);
};

export default Index;
