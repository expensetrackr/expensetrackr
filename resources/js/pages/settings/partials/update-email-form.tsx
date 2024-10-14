import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import { router, useForm, usePage } from "@inertiajs/react";

import { Button } from "#/components/button";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import { StyledLink } from "#/components/link";
import type { InertiaSharedProps } from "#/types";

export function UpdateEmailForm() {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const { data, setData, errors, ...form } = useForm({
		_method: "PUT",
		name: user?.name,
		email: user?.email,
	});
	const isEditMode = page.props.ziggy?.query?.edit === "email";

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.post(route("user-profile-information.update"), {
			errorBag: "updateProfileInformation",
			preserveScroll: true,
			onSuccess: () => router.visit(route("settings.show")),
		});
	}

	return (
		<FormSection
			title="Email address"
			description="Your email address is used to log in and receive important notifications."
		>
			{isEditMode ? (
				<form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
					<Field>
						<Label className="sr-only">Full name</Label>
						<Input
							autoComplete="email"
							autoFocus
							invalid={!!errors.email}
							name="name"
							type="email"
							onChange={(e) => setData("email", e.target.value)}
							placeholder="e.g. john@example.com"
							value={data.email}
						/>
						{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
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
					<p className="text-paragraph-sm">{user?.email}</p>

					<StyledLink
						$color="primary"
						className="gap-1 [&>[data-slot=icon]]:sm:size-5"
						href={route("settings.show", {
							edit: "email",
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
