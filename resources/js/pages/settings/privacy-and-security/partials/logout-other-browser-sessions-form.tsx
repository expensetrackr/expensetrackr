import ChromeIcon from "virtual:icons/ri/chrome-line";
import FirefoxIcon from "virtual:icons/ri/firefox-line";
import LogoutCircleRIcon from "virtual:icons/ri/logout-circle-r-line";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table";
import type { Session } from "#/types";

interface LogoutOtherBrowserSessionsFormProps {
	sessions: Session[];
}

export function LogoutOtherBrowserSessionsForm({ sessions }: LogoutOtherBrowserSessionsFormProps) {
	const [action, setAction] = useQueryState("action");
	const form = useForm({
		password: "",
	});
	const passwordRef = useRef<HTMLInputElement>(null);

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		form.delete(route("other-browser-sessions.destroy"), {
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
			title="Browser sessions"
			description="Manage and log out your active sessions on other browsers and devices."
			action={
				<>
					<Button
						$color="error"
						$variant="stroke"
						className="px-2"
						onClick={() => setAction("destroy:other-browser-sessions")}
					>
						Log out all sessions
					</Button>

					<Dialog open={action === "destroy:other-browser-sessions"} onClose={() => setAction(null)}>
						<DialogHeader>
							<DialogIcon>
								<LogoutCircleRIcon className="size-6 text-[var(--icon-sub-600)]" />
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
										ref={passwordRef}
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
		>
			{sessions.length ? (
				<Table bleed>
					<TableHead>
						<TableRow>
							<TableHeader>Browser</TableHeader>
							<TableHeader>Most recent activity</TableHeader>
							<TableHeader>IP Address</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{sessions.map((session) => (
							<TableRow key={session.id}>
								<TableCell>
									<p className="inline-flex items-center gap-3">
										<span className="inline-flex rounded-full bg-[var(--state-faded-lighter)] p-1.5">
											{session.agent.browser === "Firefox" ? <FirefoxIcon className="size-5" /> : null}
											{session.agent.browser === "Chrome" ? <ChromeIcon className="size-5" /> : null}
										</span>
										<span>{session.agent.browser}</span>
									</p>
								</TableCell>
								<TableCell>{session.is_current_device ? "Current Session" : session.last_active}</TableCell>
								<TableCell>{session.ip_address}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : null}
		</ActionSection>
	);
}
