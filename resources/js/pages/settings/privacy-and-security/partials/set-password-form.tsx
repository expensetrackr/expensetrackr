import LockPasswordIcon from "virtual:icons/ri/lock-password-line";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

import { ActionSection } from "#/components/action-section";
import { Button } from "#/components/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogHeader,
	DialogIcon,
	DialogTitle,
} from "#/components/dialog";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { Input } from "#/components/input";

export function SetPasswordForm() {
	const [isOpen, setOpen] = useState(false);
	const { data, setData, errors, ...form } = useForm({
		password: "",
		password_confirmation: "",
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.post(route("user-password.set"), {
			errorBag: "setPassword",
			preserveScroll: true,
			onSuccess: () => {
				form.reset();
				setTimeout(() => setOpen(false), 100);
			},
			onError: () => {
				if (errors.password) {
					form.reset("password", "password_confirmation");
					passwordRef.current?.focus();
				}
			},
		});
	}

	return (
		<ActionSection
			title="Set password"
			description="Create a password for enhanced account security."
			action={
				<>
					<Button $color="neutral" $variant="stroke" className="px-2" onClick={() => setOpen(true)}>
						Set password
					</Button>

					<Dialog open={isOpen} onClose={setOpen}>
						<DialogHeader>
							<DialogIcon>
								<LockPasswordIcon className="size-6 text-[var(--icon-sub-600)]" />
							</DialogIcon>

							<div className="flex flex-1 flex-col gap-1">
								<DialogTitle>Update password</DialogTitle>
								<DialogDescription>Update your password to ensure your account remains secure.</DialogDescription>
							</div>
						</DialogHeader>

						<DialogBody>
							<form onSubmit={onSubmit} id="set-password-form" className="flex flex-col gap-3">
								<Field>
									<Label>New password</Label>
									<Input
										ref={passwordRef}
										autoComplete="new-password"
										invalid={!!errors.password}
										name="password"
										type="password"
										onChange={(e) => setData("password", e.target.value)}
										placeholder="8+ characters long, 1 capital letter"
									/>
									{errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
								</Field>
								<Field>
									<Label>Confirm password</Label>
									<Input
										autoComplete="new-password"
										invalid={!!errors.password_confirmation}
										name="password"
										type="password"
										onChange={(e) => setData("password_confirmation", e.target.value)}
										placeholder="Confirm your password"
									/>
									{errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
								</Field>
							</form>
						</DialogBody>

						<DialogActions>
							<Button
								$color="neutral"
								$variant="stroke"
								$size="sm"
								disabled={form.processing}
								className="w-full"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button $size="sm" disabled={form.processing} form="set-password-form" type="submit" className="w-full">
								{form.processing ? "Saving..." : "Save"}
							</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		/>
	);
}
