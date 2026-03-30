import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function MetricCard({
  icon: Icon,
  title,
  value,
  change,
  changeType = "neutral",
}: MetricCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="border-border bg-card shadow-soft hover:shadow-elevated transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <span className={`text-sm font-medium ${changeColor[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
