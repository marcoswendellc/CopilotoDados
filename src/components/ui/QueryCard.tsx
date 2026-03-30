import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QueryCardProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

export function QueryCard({ icon: Icon, title, onClick }: QueryCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-elevated hover:scale-[1.02] border-border bg-card"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <p className="flex-1 text-sm font-medium text-card-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
