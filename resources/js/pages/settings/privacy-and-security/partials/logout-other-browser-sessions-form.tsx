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
import { ErrorMessage } from "#/components/fieldset";
import { Field, Label } from "#/components/fieldset";
import { Input } from "#/components/input";
import type { Session } from "#/types";

interface LogoutOtherBrowserSessionsFormProps {
	sessions: Session[];
}

export function LogoutOtherBrowserSessionsForm({ sessions }: LogoutOtherBrowserSessionsFormProps) {
	const [isOpen, setOpen] = useState(false);
	const passwordRef = useRef<HTMLInputElement>(null);
	const form = useForm({
		password: "",
	});

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		form.delete(route("other-browser-sessions.destroy"), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
			onError: () => passwordRef.current?.focus(),
			onFinish: () => form.reset(),
		});
	}

	function closeModal() {
		setOpen(false);

		form.reset();
	}

	return (
		<ActionSection
			title="Browser sessions"
			description="Manage and log out your active sessions on other browsers and devices."
			action={
				<>
					<Button $color="error" $variant="stroke" className="px-2" onClick={() => setOpen(true)}>
						Log out all sessions
					</Button>

					<Dialog open={isOpen} onClose={setOpen} className="sm:m-auto sm:max-w-[400px]">
						<DialogHeader>
							<DialogIcon>
								<LockPasswordIcon className="size-6 text-[var(--icon-sub-600)]" />
							</DialogIcon>

							<div className="flex flex-1 flex-col gap-1">
								<DialogTitle>Log out other browser sessions</DialogTitle>
								<DialogDescription>
									Please enter your password to confirm you would like to log out of your other browser sessions across
									all of your devices.
								</DialogDescription>
							</div>
						</DialogHeader>

						<DialogBody>
							<form onSubmit={onSubmit} id="logout-other-browser-sessions-form" className="flex flex-col gap-3">
								<Field>
									<Label>Password</Label>
									<Input
										autoComplete="current-password"
										autoFocus
										invalid={!!form.errors.password}
										name="password"
										type="password"
										onChange={(e) => form.setData("password", e.target.value)}
										placeholder="Enter your password"
										value={form.data.password}
									/>
									{form.errors.password && <ErrorMessage>{form.errors.password}</ErrorMessage>}
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
								onClick={closeModal}
							>
								Cancel
							</Button>
							<Button
								$color="error"
								$size="sm"
								disabled={form.processing}
								form="logout-other-browser-sessions-form"
								type="submit"
								className="w-full"
							>
								{form.processing ? "Logging out..." : "Yes, log me out"}
							</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		/>
	);
}
