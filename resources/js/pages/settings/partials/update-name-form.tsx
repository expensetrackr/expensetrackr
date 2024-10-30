import { router, useForm, usePage } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { Input } from "#/components/input.tsx";
import type { InertiaSharedProps } from "#/types/index.d.ts";

export function UpdateNameForm() {
	const page = usePage<InertiaSharedProps>();
	const user = page.props.auth.user;
	const { data, setData, errors, ...form } = useForm({
		_method: "PUT",
		name: user?.name,
		email: user?.email,
	});
	const debouncedName = useDebounce(data.name, 1000);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (user?.name === debouncedName) return;

		sendRequest();
	}, [debouncedName, user?.name]);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		sendRequest();
	}

	function sendRequest() {
		form.post(route("user-profile-information.update"), {
			errorBag: "updateProfileInformation",
			preserveScroll: true,
			onSuccess: () => {
				toast("Profile updated.");
				router.visit(route("settings.show"), {
					preserveState: true,
				});
				inputRef.current?.focus();
			},
		});
	}

	return (
		<FormSection title="Full name" description="Use your real name to build trust with others.">
			<form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
				<Field>
					<Label className="sr-only">Full name</Label>
					<Input
						ref={inputRef}
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
