
export default function ImagePlaceholder({
    aspect = 'video',
    label = 'Gambar akan dipasang di sini',
    icon,
    rounded = 'rounded-2xl',
    className = '',
}) {
    const aspectClasses = {
        video:    'aspect-video',
        square:   'aspect-square',
        portrait: 'aspect-[3/4]',
        wide:     'aspect-[21/9]',
        '4/3':    'aspect-[4/3]',
        '3/2':    'aspect-[3/2]',
    };

    return (
        <div
            className={`
                relative overflow-hidden w-full
                ${aspectClasses[aspect] || aspectClasses.video}
                ${rounded}
                bg-gradient-to-br from-dark-surface via-dark-card to-dark-bg
                border border-dark-border/60
                flex items-center justify-center
                group
                ${className}
            `}
            role="img"
            aria-label={label}
        >
            {}
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(62,138,51,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(62,138,51,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />

            {}
            <div
                aria-hidden="true"
                className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20 blur-3xl bg-forest-400"
            />
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-15 blur-3xl bg-sage-400"
            />

            {}
            <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
                {}
                <div className="
                    w-14 h-14 rounded-2xl
                    bg-forest-500/15 border border-forest-500/25
                    flex items-center justify-center
                    text-forest-400 text-2xl
                ">
                    {icon || (
                        
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-7 h-7"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3C7 3 3 7.5 3 12c0 2.5 1.5 5 4 6.5s5.5 1.5 7.5 0 4-4 4-6.5C18.5 7 15 3 12 3z"
                            />
                            <path
                                strokeLinecap="round"
                                d="M12 3v18M9 6c0 0 2 4 2 9"
                            />
                        </svg>
                    )}
                </div>

                {}
                <p className="text-forest-400/60 text-xs font-medium tracking-wide">
                    {label}
                </p>
            </div>
        </div>
    );
}
