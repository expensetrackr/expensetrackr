import { router, useForm, usePage } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";

import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import type { InertiaSharedProps } from "#/types";

export function UpdateNameForm() {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const { data, setData, errors, ...form } = useForm({
		_method: "PUT",
		name: user?.name,
		email: user?.email,
	});
	const debouncedName = useDebounce(data.name, 1000);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to update the workspace name when the debounced name changes
	useEffect(() => {
		if (user?.name === debouncedName) return;

		form.post(route("user-profile-information.update"), {
			errorBag: "updateProfileInformation",
			preserveScroll: true,
			onSuccess: () => router.visit(route("settings.show")),
		});
	}, [debouncedName, user?.name]);

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
			<form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
				<Field>
					<Label className="sr-only">Full name</Label>
					<Input
						autoComplete="name"
						invalid={!!errors.name}
						name="name"
						type="text"
						onChange={(e) => setData("name", e.target.value)}
						placeholder="e.g. John Doe"
						value={data.name}
						disabled={form.processing}
					/>
					{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
				</Field>
			</form>
		</FormSection>
	);
}
