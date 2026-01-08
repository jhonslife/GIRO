import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning:
          'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600',
        success: 'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600',
        info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

// Ícones para cada variante
const alertIcons = {
  default: Info,
  destructive: XCircle,
  warning: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

interface AlertWithIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

const AlertWithIcon = React.forwardRef<HTMLDivElement, AlertWithIconProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    const Icon = alertIcons[variant || 'default'];
    return (
      <Alert ref={ref} variant={variant} className={className} {...props}>
        <Icon className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  }
);
AlertWithIcon.displayName = 'AlertWithIcon';

export { Alert, AlertDescription, AlertTitle, alertVariants, AlertWithIcon };
