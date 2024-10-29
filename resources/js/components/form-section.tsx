interface FormSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="col-span-12 md:col-span-5">
				{(title || description) && (
					<div className="flex flex-col gap-1">
						<h2 className="text-label-sm">{title}</h2>
						{description && <p className="text-[var(--text-sub-600)] text-paragraph-xs">{description}</p>}
					</div>
				)}
			</div>

			<div className="col-span-12 md:col-span-7">
				<div className="flex flex-col items-start gap-2">{children}</div>
			</div>
		</div>
	);
}
