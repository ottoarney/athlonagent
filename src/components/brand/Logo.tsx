import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
  className?: string;
  priority?: boolean;
}

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6 md:h-7',
  md: 'h-8 md:h-9',
  lg: 'h-10 md:h-12',
};

export function Logo({ size = 'md', variant = 'default', className, priority = false }: LogoProps) {
  return (
    <img
      src="/athlon-logo.svg"
      alt="Athlon"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(
        'w-auto max-w-full object-contain transition duration-300 ease-out',
        sizeClasses[size],
        variant === 'light' && 'brightness-0 invert',
        className,
      )}
    />
  );
}
