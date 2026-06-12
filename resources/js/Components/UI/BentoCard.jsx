import { forwardRef } from 'react';


const BentoCard = forwardRef(function BentoCard(
    {
        children,
        variant = 'default',
        size = 'md',
        glow = false,
        hoverable = false,
        rounded = '2xl',
        as: Tag = 'div',
        className = '',
        ...props
    },
    ref
) {
    
    const sizeClasses = {
        sm: 'p-4',
        md: 'p-5 md:p-6',
        lg: 'p-6 md:p-8',
        xl: 'p-8 md:p-10',
    };

    
    const roundedClasses = {
        lg:   'rounded-lg',
        xl:   'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        '4xl': 'rounded-4xl',
    };

    
    const variantClasses = {
        
        default: `
            bg-dark-card/60
            backdrop-blur-md
            border border-dark-border/80
        `,
        
        solid: `
            bg-dark-card
            border border-dark-border
        `,
        
        highlighted: `
            bg-dark-surface/70
            backdrop-blur-md
            border border-forest-500/30
        `,
        
        ghost: `
            bg-transparent
            border border-dark-border/40
        `,
    };

    
    const hoverClasses = hoverable
        ? `
            cursor-pointer
            transition-all duration-400 ease-out
            hover:border-forest-500/40
            hover:shadow-card-hover
            hover:bg-dark-card/80
        `
        : 'transition-colors duration-300';

    
    const glowClasses = glow
        ? 'shadow-forest-md'
        : '';

    return (
        <Tag
            ref={ref}
            className={`
                relative overflow-hidden
                ${sizeClasses[size] || sizeClasses.md}
                ${roundedClasses[rounded] || roundedClasses['2xl']}
                ${variantClasses[variant] || variantClasses.default}
                ${hoverClasses}
                ${glowClasses}
                ${className}
            `}
            {...props}
        >
            {}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                    background:
                        'linear-gradient(135deg, rgba(130,178,112,0.07) 0%, transparent 50%)',
                }}
            />

            {}
            <div className="relative z-10">
                {children}
            </div>
        </Tag>
    );
});

export default BentoCard;
