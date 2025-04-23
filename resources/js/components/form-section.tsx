interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,26fr)_minmax(0,37fr)]">
            <div>
                {(title || description) && (
                    <div className="flex flex-col gap-1">
                        <h2 className="text-label-sm text-(--text-strong-950)">{title}</h2>
                        {description && <p className="text-paragraph-xs text-(--text-sub-600)">{description}</p>}
                    </div>
                )}
            </div>

            {children}
        </div>
    );
}
