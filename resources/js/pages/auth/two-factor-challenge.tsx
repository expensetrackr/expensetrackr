import { Head, useForm } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

import { Button } from "#/components/button.tsx";
import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "#/components/input-otp.tsx";
import { Input } from "#/components/input.tsx";
import { StyledLink } from "#/components/link.tsx";
import { AuthLayout } from "#/layouts/auth-layout.tsx";

export default function TwoFactorChallenge() {
	const [recovery, setRecovery] = useState(false);
	const { data, setData, post, errors, processing } = useForm({
		code: "",
		recovery_code: "",
	});

	const toggleRecovery = (e: React.FormEvent) => {
		e.preventDefault();
		const isRecovery = !recovery;
		setRecovery(isRecovery);

		setTimeout(() => {
			if (isRecovery) {
				setData("code", "");
			} else {
				setData("recovery_code", "");
			}
		}, 100);
	};

	const submit: React.FormEventHandler = (e) => {
		e.preventDefault();

		post(route("two-factor.login"));
	};

	return (
		<AuthLayout
			title="Two-Factor Confirmation"
			description={
				recovery
					? "Please confirm access to your account by entering one of your emergency recovery codes."
					: "Please confirm access to your account by entering the authentication code provided by your authenticator application."
			}
		>
			<Head title="Two-Factor Confirmation" />

			<form className="flex flex-col gap-3" onSubmit={submit}>
				{recovery ? (
					<Field>
						<Label>Recovery code</Label>
						<Input
							autoComplete="name"
							autoFocus
							invalid={!!errors.recovery_code}
							name="name"
							onChange={(e) => setData("recovery_code", e.target.value)}
							value={data.recovery_code}
						/>
						{errors.recovery_code && <ErrorMessage>{errors.recovery_code}</ErrorMessage>}
					</Field>
				) : (
					<Field>
						<Label htmlFor="code">Code</Label>
						<InputOTP
							autoComplete="one-time-code"
							autoFocus
							id="code"
							maxLength={6}
							pattern={REGEXP_ONLY_DIGITS}
							value={data.code}
							onChange={(value) => setData("code", value)}
						>
							<InputOTPGroup className="w-full gap-1">
								<InputOTPSlot index={0} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
								<InputOTPSlot index={1} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
								<InputOTPSlot index={2} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
								<InputOTPSlot index={3} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
								<InputOTPSlot index={4} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
								<InputOTPSlot index={5} className="rounded-10 border after:rounded-[9px]" invalid={!!errors.code} />
							</InputOTPGroup>
						</InputOTP>
						{errors.code && <ErrorMessage>{errors.code}</ErrorMessage>}
					</Field>
				)}

				<div className="flex items-center justify-end gap-3 py-2">
					<StyledLink as="button" href={route("two-factor.login")} onClick={toggleRecovery}>
						{recovery ? "Use an authentication code" : "Use a recovery code"}
					</StyledLink>
				</div>

				<Button type="submit" disabled={processing}>
					Log in
				</Button>
			</form>
		</AuthLayout>
	);
}
