import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = "accent" }) => (
  <div className="bg-card rounded-xl border p-5 card-hover">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-heading font-bold mt-1">{value}</p>
        {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      </div>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
