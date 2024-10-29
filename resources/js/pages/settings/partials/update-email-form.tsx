import { router, useForm, usePage } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";

import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import type { InertiaSharedProps } from "#/types";

export function UpdateEmailForm() {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const { data, setData, errors, ...form } = useForm({
		_method: "PUT",
		name: user?.name,
		email: user?.email,
	});
	const debouncedEmail = useDebounce(data.email, 1000);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to update the name when the debounced name changes
	useEffect(() => {
		if (user?.email === debouncedEmail) return;

		form.post(route("user-profile-information.update"), {
			errorBag: "updateProfileInformation",
			preserveScroll: true,
			onSuccess: () => router.visit(route("settings.show")),
		});
	}, [debouncedEmail, user?.name]);

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
			<form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
				<Field>
					<Label className="sr-only">Email address</Label>
					<Input
						autoComplete="email"
						invalid={!!errors.email}
						name="name"
						type="email"
						onChange={(e) => setData("email", e.target.value)}
						placeholder="e.g. john@example.com"
						value={data.email}
						disabled={form.processing}
					/>
					{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
				</Field>
			</form>
		</FormSection>
	);
}
