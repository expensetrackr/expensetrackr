import type { Config } from "ziggy-js";

type DateTime = string;

export type Nullable<T> = T | null;

export interface Workspace {
	id: number;
	name: string;
	personal_workspace: boolean;
	created_at: DateTime;
	updated_at: DateTime;
}

export interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at: string;
	current_workspace_id: number;
	profile_photo_path: Nullable<string>;
	profile_photo_url: string;
	two_factor_enabled: boolean;
	has_password: boolean;
	created_at: DateTime;
	updated_at: DateTime;
}

export interface Auth {
	user: Nullable<
		User & {
			all_workspaces: Array<Workspace>;
			current_workspace: Workspace;
		}
	>;
}

export type ProviderType = "google";
export type Provider = {
	id: ProviderType;
	name: string;
	buttonLabel?: string;
};

export type ConnectedAccountType = {
	id: number;
	provider: ProviderType;
	avatar_path: string;
	created_at: string;
};

export type InertiaSharedProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	workspaces: {
		canCreateWorkspaces: boolean;
		canManageTwoFactorAuthentication: boolean;
		canUpdatePassword: boolean;
		canUpdateProfileInformation: boolean;
		flash: Array<string>;
		hasAccountDeletionFeatures: boolean;
		hasApiFeatures: boolean;
		hasWorkspaceFeatures: boolean;
		hasTermsAndPrivacyPolicyFeature: boolean;
		managesProfilePhotos: boolean;
		hasEmailVerification: boolean;
	};
	auth: Auth;
	errorBags: Record<string, Record<string, Array<string>>>;
	errors: Record<string, string>;
	socialstream: {
		providers: Array<Provider>;
		show: boolean;
		connectedAccounts: Array<ConnectedAccountType>;
		hasPassword: boolean;
	};
};

export interface Session {
	id: number;
	ip_address: string;
	is_current_device: boolean;
	agent: {
		is_desktop: boolean;
		platform: string;
		browser: string;
	};
	last_active: DateTime;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	auth: {
		user: User;
	};
	ziggy: Config & { location: string };
};
