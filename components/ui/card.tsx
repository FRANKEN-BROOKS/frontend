import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-lg p-6',
      bordered: 'bg-white border border-gray-200 rounded-lg p-6',
      elevated: 'bg-white shadow-lg rounded-lg p-6',
    };

    return (
      <div
        ref={ref}
        className={clsx(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={clsx('text-2xl font-bold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx(className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';