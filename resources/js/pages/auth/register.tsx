import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";

import { Button } from "#/components/button";
import { Checkbox, CheckboxField } from "#/components/checkbox";
import { Description, ErrorMessage, Field, Label } from "#/components/fieldset";
import { Input } from "#/components/input";
import { Link, StyledLink } from "#/components/link";
import { Socialstream } from "#/components/socialstream";
import { AuthLayout } from "#/layouts/auth-layout";
import type { InertiaSharedProps } from "#/types";

export default function Register({ socialstream }: InertiaSharedProps) {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
		terms: false,
		remember: false,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: not need to be updated on reset change
	useEffect(() => {
		return () => {
			reset("password", "password_confirmation");
		};
	}, []);

	const submit: React.FormEventHandler = (e) => {
		e.preventDefault();

		post(route("register"));
	};

	return (
		<AuthLayout
			title="Sign up"
			description="Create an account to start tracking your expenses"
			footer={
				<>
					Already have account?{" "}
					<StyledLink $color="black" className="font-bold" href={route("login")}>
						Log in
					</StyledLink>
				</>
			}
		>
			<Head title="Register" />

			<form className="flex flex-col gap-3" onSubmit={submit}>
				<Field>
					<Label>Name</Label>
					<Input
						autoComplete="name"
						autoFocus
						invalid={!!errors.name}
						name="name"
						onChange={(e) => setData("name", e.target.value)}
						placeholder="e.g. John Doe"
						value={data.name}
					/>
					{errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
				</Field>

				<Field>
					<Label>Email</Label>
					<Input
						autoComplete="username"
						invalid={!!errors.email}
						name="email"
						type="email"
						onChange={(e) => setData("email", e.target.value)}
						placeholder="e.g. john@example.com"
						value={data.email}
					/>
					{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
				</Field>

				<Field>
					<Label>Password</Label>
					<Input
						autoComplete="new-password"
						invalid={!!errors.password}
						name="password"
						type="password"
						onChange={(e) => setData("password", e.target.value)}
						placeholder="8+ characters long, 1 capital letter"
						value={data.password}
					/>
					{errors.password ? (
						<ErrorMessage>{errors.password}</ErrorMessage>
					) : (
						<Description>Must be at least 8 characters long</Description>
					)}
				</Field>

				<Field>
					<Label>Confirm password</Label>
					<Input
						autoComplete="new-password"
						invalid={!!errors.password_confirmation}
						name="password_confirmation"
						type="password"
						onChange={(e) => setData("password_confirmation", e.target.value)}
						placeholder="Confirm your password"
						value={data.password_confirmation}
					/>
					{errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
				</Field>

				<div className="flex flex-col gap-3 py-2">
					<CheckboxField className="items-start">
						<Checkbox
							className="mt-px"
							name="terms"
							checked={data.terms}
							onChange={(checked) => setData("terms", checked)}
						/>
						<Label className="text-paragraph-sm">
							I agree with the{" "}
							<Link href={route("terms.show")} className="font-bold">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href={route("policy.show")} className="font-bold">
								Privacy Policy
							</Link>
						</Label>

						{errors.terms && <ErrorMessage className="col-span-full">{errors.terms}</ErrorMessage>}
					</CheckboxField>

					<CheckboxField>
						<Checkbox name="remember" checked={data.remember} onChange={(checked) => setData("remember", checked)} />
						<Label className="text-paragraph-sm">Remember me</Label>
					</CheckboxField>
				</div>

				<Button type="submit" disabled={processing}>
					Get started
				</Button>
			</form>

			{socialstream.show && <Socialstream />}
		</AuthLayout>
	);
}
