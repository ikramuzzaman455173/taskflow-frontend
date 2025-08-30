// import { cn } from '@/lib/utils';

// interface LoadingSpinnerProps {
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
// }

// export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
//   const sizeClasses = {
//     sm: 'h-4 w-4',
//     md: 'h-6 w-6',
//     lg: 'h-8 w-8'
//   };

//   return (
//     <div className={cn(
//       'loading-spinner',
//       sizeClasses[size],
//       className
//     )} />
//   );
// }


import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'secondary',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variantClasses = {
    default:
      'border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white',
    primary:
      'border-blue-300 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400',
    secondary:
      'border-gray-300 border-t-gray-500 dark:border-gray-700 dark:border-t-gray-400',
    accent:
      'border-purple-300 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-2',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
