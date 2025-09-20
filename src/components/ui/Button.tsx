import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-primary text-white hover:bg-primary/90 shadow-md': variant === 'default',
        'bg-red-600 text-white hover:bg-red-700 shadow-md': variant === 'destructive',
        'border border-border bg-background text-foreground hover:bg-background-secondary': variant === 'outline',
        'bg-secondary text-white hover:bg-secondary/90 shadow-md': variant === 'secondary',
        'hover:bg-background-muted text-foreground': variant === 'ghost',
        'text-primary underline-offset-4 hover:underline': variant === 'link',
      },
      {
        'h-10 px-4 py-2': size === 'default',
        'h-9 rounded-md px-3 text-sm': size === 'sm',
        'h-11 rounded-md px-8 text-base': size === 'lg',
        'h-10 w-10': size === 'icon',
      },
      className
    );

    if (asChild) {
      return (
        <div className={baseClasses}>
          {children}
        </div>
      );
    }
    
    return (
      <button
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
