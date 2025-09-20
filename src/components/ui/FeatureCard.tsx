import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
}

export function FeatureCard({ title, description, icon, variant = 'default' }: FeatureCardProps) {
  const colorClasses = {
    default: 'bg-background border-border',
    primary: 'bg-background-muted border-primary/20', 
    secondary: 'bg-secondary/5 border-secondary/20',
    muted: 'bg-background-secondary border-border',
  };

  const titleClasses = {
    default: 'text-foreground',
    primary: 'text-primary-dark',
    secondary: 'text-secondary', 
    muted: 'text-foreground-secondary',
  };

  const descriptionClasses = {
    default: 'text-foreground-secondary',
    primary: 'text-primary',
    secondary: 'text-secondary-light',
    muted: 'text-foreground-muted',
  };

  return (
    <Card className={colorClasses[variant]}>
      <CardHeader>
        <CardTitle className={`text-lg font-semibold ${titleClasses[variant]} flex items-center gap-2`}>
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={descriptionClasses[variant]}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
