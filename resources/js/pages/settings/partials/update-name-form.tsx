import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import { router, useForm, usePage } from "@inertiajs/react";

import { Button } from "#/components/button";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import { StyledLink } from "#/components/link";
import type { InertiaSharedProps } from "#/types";

export function UpdateNameForm() {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const { data, setData, errors, ...form } = useForm({
		_method: "PUT",
		name: user?.name,
		email: user?.email,
	});
	const isEditMode = page.props.ziggy?.query?.edit === "name";

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.post(route("user-profile-information.update"), {
			errorBag: "updateProfileInformation",
			preserveScroll: true,
			onSuccess: () => router.visit(route("settings.show")),
		});
	}

	return (
		<FormSection title="Full name" description="Use your real name to build trust with others.">
			{isEditMode ? (
				<form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
					<Field>
						<Label className="sr-only">Full name</Label>
						<Input
							autoComplete="name"
							autoFocus
							invalid={!!errors.name}
							name="name"
							type="text"
							onChange={(e) => setData("name", e.target.value)}
							placeholder="e.g. John Doe"
							value={data.name}
						/>
						{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
					</Field>

					<div className="flex items-center justify-end gap-2">
						<Button $color="neutral" $variant="stroke" $size="sm" href={route("settings.show")} className="px-2">
							Cancel
						</Button>
						<Button $size="sm" className="px-4" type="submit">
							{form.processing ? "Updating..." : "Update"}
						</Button>
					</div>
				</form>
			) : (
				<>
					<p className="text-paragraph-sm">{user?.name}</p>

					<StyledLink
						$color="primary"
						className="gap-1 [&>[data-slot=icon]]:sm:size-5"
						href={route("settings.show", {
							edit: "name",
						})}
					>
						<span>Edit</span>
						<ArrowRightSIcon />
					</StyledLink>
				</>
			)}
		</FormSection>
	);
}
