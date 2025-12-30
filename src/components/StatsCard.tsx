import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'warning' | 'info' | 'destructive' | 'success';
  index: number;
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  success: 'bg-success/10 text-success border-success/20',
};

export const StatsCard = ({ title, value, icon: Icon, color, index }: StatsCardProps) => {
  return (
    <div
      className="glass rounded-xl p-5 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
