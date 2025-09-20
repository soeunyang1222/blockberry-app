import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface QuickAction {
  href: string;
  label: string;
  icon: string;
  colorScheme: 'blue' | 'green' | 'purple';
}

interface QuickActionCardProps {
  actions: QuickAction[];
}

export function QuickActionCard({ actions }: QuickActionCardProps) {
  const getColorClasses = (colorScheme: QuickAction['colorScheme']) => {
    const classes = {
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 text-green-700',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
    };
    return classes[colorScheme];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          빠른 작업
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${getColorClasses(action.colorScheme)}`}
          >
            {action.icon} {action.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
