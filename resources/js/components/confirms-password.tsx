import LockPasswordIcon from "virtual:icons/ri/lock-password-line";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useRef, useState } from "react";

import { Button } from "./button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogHeader, DialogIcon, DialogTitle } from "./dialog";
import { ErrorMessage, Field, Label } from "./fieldset";
import { Input } from "./input";

interface ConfirmsPasswordProps {
	onConfirm?: () => void;
	children: React.ReactNode;
}

export function ConfirmsPassword({ onConfirm, children }: ConfirmsPasswordProps) {
	const [isOpen, setOpen] = useState(false);
	const { data, setData, errors, ...form } = useForm({
		password: "",
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function startConfirmingPassword() {
		axios.get(route("password.confirmation")).then((response) => {
			if (response.data.confirmed) {
				onConfirm?.();
			} else {
				setOpen(true);
			}
		});
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.post(route("password.confirm"), {
			errorBag: "password",
			preserveScroll: true,
			onSuccess: () => {
				setOpen(false);
				form.reset();
				setTimeout(() => onConfirm?.(), 250);
			},
			onError: () => {
				if (errors.password) {
					form.reset("password");
					passwordRef.current?.focus();
				}
			},
		});
	}

	return (
		<>
			<span onClick={startConfirmingPassword} onKeyDown={(e) => e.key === "Enter" && startConfirmingPassword()}>
				{children}
			</span>

			<Dialog open={isOpen} onClose={setOpen}>
				<DialogHeader>
					<DialogIcon>
						<LockPasswordIcon className="size-6 text-[var(--icon-sub-600)]" />
					</DialogIcon>

					<div className="flex flex-1 flex-col gap-1">
						<DialogTitle>Confirm Password</DialogTitle>
						<DialogDescription>For your security, please confirm your password to continue.</DialogDescription>
					</div>
				</DialogHeader>

				<DialogBody>
					<form onSubmit={onSubmit} id="set-password-form" className="flex flex-col gap-3">
						<Field>
							<Label>Password</Label>
							<Input
								ref={passwordRef}
								autoComplete="current-password"
								autoFocus
								invalid={!!errors.password}
								name="password"
								type="password"
								onChange={(e) => setData("password", e.target.value)}
								placeholder="Enter your password"
							/>
							{errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
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
						{form.processing ? "Confirming..." : "Confirm"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
