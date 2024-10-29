import DeleteBinIcon from "virtual:icons/ri/delete-bin-line";
import { useForm } from "@inertiajs/react";
import { useQueryState } from "nuqs";
import { useRef } from "react";

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

export function DeleteUserForm() {
	const [action, setAction] = useQueryState("action");
	const form = useForm({
		password: "",
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.delete(route("current-user.destroy"), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
			onError: () => passwordRef.current?.focus(),
			onFinish: () => form.reset(),
		});
	}

	async function closeModal() {
		await setAction(null);

		form.reset();
	}

	return (
		<ActionSection
			title="Delete account"
			description="Permanently delete your account."
			action={
				<>
					<Button $color="error" $variant="stroke" className="px-2" onClick={() => setAction("destroy:current-user")}>
						Delete account
					</Button>

					<Dialog open={action === "destroy:current-user"} onClose={() => setAction(null)}>
						<DialogHeader>
							<DialogIcon>
								<DeleteBinIcon className="size-6 text-[var(--icon-sub-600)]" />
							</DialogIcon>

							<div className="flex flex-1 flex-col gap-1">
								<DialogTitle>Delete account</DialogTitle>
								<DialogDescription>
									Once your account is deleted, all of its resources and data will be permanently deleted.
								</DialogDescription>
							</div>
						</DialogHeader>

						<DialogBody>
							<form onSubmit={onSubmit} id="delete-user-form" className="flex flex-col gap-3">
								<Field>
									<Label>Password</Label>
									<Input
										ref={passwordRef}
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
								form="delete-user-form"
								type="submit"
								className="w-full"
							>
								{form.processing ? "Deleting..." : "Yes, delete my account"}
							</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		/>
	);
}
