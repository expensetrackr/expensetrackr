export enum Action {
    ConnectedAccountsDestroy = "connected-accounts:destroy:{id}",
    CurrentUserDestroy = "current-user:destroy",
    OtherBrowserSessionsDestroy = "other-browser-sessions:destroy",
    PasswordConfirm = "password:confirm",
    TwoFactorEnable = "two-factor:enable",
    TwoFactorConfirm = "two-factor:confirm",
    TwoFactorDisable = "two-factor:disable",
    UserPasswordCreate = "user-password:create",
    UserPasswordUpdate = "user-password:update",
    WorkspaceInvitationsDestroy = "workspace-invitations:destroy:{id}",
    WorkspaceMembersCreate = "workspace-members:create",
    WorkspaceMembersUpdate = "workspace-members:update:{id}",
    WorkspaceMembersDestroy = "workspace-members:destroy:{id}",
}

export function getAction<T extends keyof typeof Action>(
    key: T,
): T extends
    | "CurrentUserDestroy"
    | "OtherBrowserSessionsDestroy"
    | "PasswordConfirm"
    | "TwoFactorEnable"
    | "TwoFactorConfirm"
    | "TwoFactorDisable"
    | "UserPasswordCreate"
    | "UserPasswordUpdate"
    | "WorkspaceMembersCreate"
    ? (typeof Action)[T]
    : never;
export function getAction<T extends keyof typeof Action>(
    key: T,
    id: string | number,
): T extends
    | "ConnectedAccountsDestroy"
    | "WorkspaceInvitationsDestroy"
    | "WorkspaceMembersUpdate"
    | "WorkspaceMembersDestroy"
    ? (typeof Action)[T]
    : never;
export function getAction<T extends keyof typeof Action>(key: T, id?: string | number): (typeof Action)[T] {
    const action = Action[key];
    if (typeof action === "string" && action.includes("{id}")) {
        if (!id) {
            throw new Error(`ID is required for action ${key}`);
        }
        return action.replace("{id}", String(id)) as (typeof Action)[T];
    }
    return action;
}
