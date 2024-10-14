import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

import { ActionSection } from "#/components/action-section";
import { Button } from "#/components/button";
import { ConfirmsPassword } from "#/components/confirms-password";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { Input } from "#/components/input";
import type { PageProps } from "#/types";

interface TwoFactorAuthenticationFormProps {
	requiresConfirmation: boolean;
}

export function TwoFactorAuthenticationForm({ requiresConfirmation, ...props }: TwoFactorAuthenticationFormProps) {
	const page = usePage<PageProps>();
	const [enabling, setEnabling] = useState(false);
	const [disabling, setDisabling] = useState(false);
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
	const [confirming, setConfirming] = useState(false);
	const [setupKey, setSetupKey] = useState<string | null>(null);
	const confirmationForm = useForm({
		code: "",
	});
	const twoFactorEnabled = !enabling && page.props?.auth?.user?.two_factor_enabled;

	function enableTwoFactorAuthentication() {
		setEnabling(true);

		router.post(
			"/user/two-factor-authentication",
			{},
			{
				preserveScroll: true,
				onSuccess() {
					return Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]);
				},
				onFinish() {
					setEnabling(false);
					setConfirming(requiresConfirmation);
				},
			},
		);
	}

	async function showSetupKey() {
		return axios.get("/user/two-factor-secret-key").then((response) => {
			setSetupKey(response.data.secretKey);
		});
	}

	function confirmTwoFactorAuthentication() {
		confirmationForm.post("/user/confirmed-two-factor-authentication", {
			preserveScroll: true,
			preserveState: true,
			errorBag: "confirmTwoFactorAuthentication",
			onSuccess: () => {
				setConfirming(false);
				setQrCode(null);
				setSetupKey(null);
			},
		});
	}

	async function showQrCode() {
		return axios.get("/user/two-factor-qr-code").then((response) => {
			setQrCode(response.data.svg);
		});
	}

	async function showRecoveryCodes() {
		return axios.get("/user/two-factor-recovery-codes").then((response) => {
			setRecoveryCodes(response.data);
		});
	}

	function regenerateRecoveryCodes() {
		axios.post("/user/two-factor-recovery-codes").then(() => {
			showRecoveryCodes();
		});
	}

	function disableTwoFactorAuthentication() {
		setDisabling(true);

		router.delete("/user/two-factor-authentication", {
			preserveScroll: true,
			onSuccess() {
				setDisabling(false);
				setConfirming(false);
			},
		});
	}

	const getDescription = () => {
		if ((twoFactorEnabled || confirming) && qrCode) {
			if (confirming) {
				return "To finish enabling two-factor authentication, scan the image below with your 2FA authenticator app or manually enter the setup key:";
			}

			return "Two-factor authentication is now enabled. Scan the image below with your 2FA authenticator app or manually enter the setup key:";
		}

		if (recoveryCodes.length > 0) {
			return "Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.";
		}

		return "Add an extra layer of protection to your account.";
	};

	return (
		<ActionSection
			title="Two-factor Authentication"
			description={getDescription()}
			action={
				twoFactorEnabled || confirming ? (
					<>
						{recoveryCodes.length > 0 && !confirming ? (
							<ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
								<Button $color="error" $variant="stroke" className="px-4">
									Regenerate recovery codes
								</Button>
							</ConfirmsPassword>
						) : null}
						{confirming ? (
							<ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
								<Button $color="neutral" $variant="stroke" className="px-4" disabled={disabling}>
									Cancel
								</Button>
							</ConfirmsPassword>
						) : (
							<ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
								<Button $color="error" $variant="stroke" className="px-4" disabled={disabling}>
									Disable 2FA
								</Button>
							</ConfirmsPassword>
						)}
						{confirming ? (
							<ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
								<Button className="px-4">Finish setup</Button>
							</ConfirmsPassword>
						) : null}
						{recoveryCodes.length === 0 && !confirming ? (
							<ConfirmsPassword onConfirm={showRecoveryCodes}>
								<Button $color="neutral" $variant="stroke" className="px-4">
									Show recovery codes
								</Button>
							</ConfirmsPassword>
						) : null}
					</>
				) : (
					<ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
						<Button $color="neutral" $variant="stroke" className="px-4" disabled={enabling}>
							Enable 2FA
						</Button>
					</ConfirmsPassword>
				)
			}
		>
			<div className="flex flex-col gap-4">
				{twoFactorEnabled || confirming ? (
					<>
						{qrCode ? (
							<div className="grid grid-cols-12 items-center gap-8">
								<div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:col-start-4">
									<div className="qr-container relative mx-auto inline-block size-48 overflow-hidden rounded-12 p-0.5">
										<div
											className="relative z-10 rounded-8 bg-[var(--bg-white-0)] p-2 [&>svg]:size-full"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: Laravel generates the QR code as SVG
											dangerouslySetInnerHTML={{ __html: qrCode }}
										/>
									</div>

									<div className="mx-auto flex h-3 w-full max-w-48 flex-row items-center gap-2.5 self-stretch whitespace-nowrap text-[var(--text-soft-400)] text-subheading-2xs uppercase before:h-px before:w-full before:flex-grow before:bg-[var(--stroke-soft-200)] after:h-px after:w-full after:flex-grow after:bg-[var(--stroke-soft-200)]">
										or
									</div>

									{setupKey ? (
										<div className="mx-auto w-full max-w-56 rounded-8 bg-[var(--bg-weak-50)] p-2">
											<p className="text-center text-[var(--text-sub-600)] text-label-sm">Setup key:</p>
											<p className="text-center font-semibold text-xs">{setupKey}</p>
										</div>
									) : null}

									{confirming ? (
										<div className="col-span-12 flex flex-col gap-4 md:col-span-6">
											<ol className="flex list-decimal flex-col gap-1.5">
												<li className="text-[var(--text-sub-600)] text-paragraph-sm">
													First, download the two-factor authentication app on your phone.
												</li>

												<li className="text-[var(--text-sub-600)] text-paragraph-sm">
													Scan the image above with the two-factor authentication app on your phone.
												</li>

												<li className="text-[var(--text-sub-600)] text-paragraph-sm">
													Enter the six-digit code from the app.
												</li>

												<li className="text-[var(--text-sub-600)] text-paragraph-sm">
													Click the button below to finish enabling two factor authentication.
												</li>
											</ol>

											<Field>
												<Label>Enter verification code</Label>
												<Input
													autoComplete="one-time-code"
													autoFocus
													invalid={!!confirmationForm.errors.code}
													name="code"
													type="numeric"
													onChange={(e) => confirmationForm.setData("code", e.target.value)}
													value={confirmationForm.data.code}
												/>
												{confirmationForm.errors.code && <ErrorMessage>{confirmationForm.errors.code}</ErrorMessage>}
											</Field>
										</div>
									) : null}
								</div>
							</div>
						) : null}

						{recoveryCodes.length && !confirming ? (
							<div className="grid max-w-xl gap-1 rounded-lg bg-[var(--bg-surface-700)] px-4 py-4 font-mono text-sm text-white">
								{recoveryCodes.map((code) => (
									<div key={code}>{code}</div>
								))}
							</div>
						) : null}
					</>
				) : null}
			</div>
		</ActionSection>
	);
}
