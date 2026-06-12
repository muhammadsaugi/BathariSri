import { forwardRef } from 'react';


const Button = forwardRef(function Button(
    {
        as: Tag = 'button',
        children,
        variant = 'primary',
        size = 'md',
        rounded = 'full',
        loading = false,
        leftIcon,
        rightIcon,
        className = '',
        disabled,
        ...props
    },
    ref
) {
    
    const sizeClasses = {
        sm: 'px-4 py-2 text-xs gap-1.5',
        md: 'px-6 py-2.5 text-sm gap-2',
        lg: 'px-7 py-3 text-sm gap-2',
        xl: 'px-9 py-3.5 text-base gap-2.5',
    };

    
    const roundedClasses = {
        full: 'rounded-full',
        xl:   'rounded-xl',
        lg:   'rounded-lg',
    };

    
    const variantBase = {
        primary: [
            'bg-gradient-to-br from-forest-500 to-forest-600',
            'text-cream-50 font-medium',
            'shadow-[0_4px_16px_rgba(62,138,51,0.20)]',
            'hover:from-forest-600 hover:to-forest-700',
            'hover:shadow-[0_4px_24px_rgba(62,138,51,0.38)]',
            'focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b0a]',
        ].join(' '),

        secondary: [
            'bg-transparent',
            'text-forest-300 font-medium',
            'border border-forest-500/30',
            'hover:bg-forest-500/10',
            'hover:border-forest-500/60',
            'hover:text-forest-200',
            'focus-visible:ring-2 focus-visible:ring-forest-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b0a]',
        ].join(' '),

        ghost: [
            'bg-transparent',
            'text-forest-300/80 font-medium',
            'hover:bg-forest-500/10',
            'hover:text-forest-200',
            'focus-visible:ring-2 focus-visible:ring-forest-500/40',
        ].join(' '),

        danger: [
            'bg-gradient-to-br from-red-700 to-red-800',
            'text-white font-medium shadow-sm',
            'hover:from-red-800 hover:to-red-900 hover:shadow-md',
            'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b0a]',
        ].join(' '),
    };

    const isDisabled = disabled || loading;

    const baseClass = [
        'inline-flex items-center justify-center',
        'font-sans tracking-wide',
        'transition-all duration-300 ease-out',
        'active:scale-[0.97]',
        'select-none',
        isDisabled
            ? 'opacity-50 cursor-not-allowed pointer-events-none'
            : 'cursor-pointer',
        sizeClasses[size]   ?? sizeClasses.md,
        roundedClasses[rounded] ?? roundedClasses.full,
        variantBase[variant] ?? variantBase.primary,
        className,
    ].join(' ');

    return (
        <Tag
            ref={ref}
            disabled={Tag === 'button' ? isDisabled : undefined}
            aria-disabled={isDisabled || undefined}
            className={baseClass}
            {...props}
        >
            {}
            {loading && (
                <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}

            {}
            {!loading && leftIcon && (
                <span className="shrink-0 leading-none" aria-hidden="true">{leftIcon}</span>
            )}

            {}
            <span>{children}</span>

            {}
            {!loading && rightIcon && (
                <span className="shrink-0 leading-none" aria-hidden="true">{rightIcon}</span>
            )}
        </Tag>
    );
});

export default Button;
