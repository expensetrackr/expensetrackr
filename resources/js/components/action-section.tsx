export function ActionSection({
    title,
    description,
    action,
    children,
}: {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-6 empty:hidden sm:flex-row sm:items-center sm:justify-between">
                {(title || description) && (
                    <header className="flex flex-1 flex-col gap-1">
                        {title && <h2 className="text-label-sm">{title}</h2>}

                        {description && <p className="text-paragraph-xs text-[var(--text-sub-600)]">{description}</p>}
                    </header>
                )}

                {action && <div className="flex items-center gap-2">{action}</div>}
            </div>

            {children && <div>{children}</div>}
        </section>
    );
}
