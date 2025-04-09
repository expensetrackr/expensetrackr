import connectionType from "./routes/accounts/create/connection-type.ts";
import accounts from "./routes/accounts/index.ts";
import categories from "./routes/categories/index.ts";
import connectedAccounts from "./routes/connected-accounts/index.ts";
import currentUser from "./routes/current-user/index.ts";
import currentUserPhoto from "./routes/current-user-photo/index.ts";
import currentWorkspace from "./routes/current-workspace/index.ts";
import dashboard from "./routes/dashboard.ts";
import home from "./routes/home.ts";
import language from "./routes/language/index.ts";
import login from "./routes/login.ts";
import logout from "./routes/logout.ts";
import oauth from "./routes/oauth/index.ts";
import otherBrowserSessions from "./routes/other-browser-sessions/index.ts";
import password from "./routes/password/index.ts";
import policy from "./routes/policy/index.ts";
import register from "./routes/register.ts";
import settings from "./routes/settings/index.ts";
import terms from "./routes/terms/index.ts";
import transactions from "./routes/transactions/index.ts";
import twoFactor from "./routes/two-factor/index.ts";
import userPassword from "./routes/user-password/index.ts";
import userProfileInformation from "./routes/user-profile-information/index.ts";
import verification from "./routes/verification/index.ts";
import workspaceInvitations from "./routes/workspace-invitations/index.ts";
import workspaceMembers from "./routes/workspace-members/index.ts";
import workspaces from "./routes/workspaces/index.ts";

export const routes = {
    accounts: {
        ...accounts,
        create: {
            ...accounts.create,
            connectionType: connectionType,
        },
    },
    categories,
    connectedAccounts,
    currentUser,
    currentUserPhoto,
    currentWorkspace,
    dashboard,
    home,
    language,
    login,
    logout,
    oauth,
    otherBrowserSessions,
    password,
    policy,
    register,
    settings,
    terms,
    transactions,
    twoFactor,
    userPassword,
    userProfileInformation,
    verification,
    workspaceInvitations,
    workspaceMembers,
    workspaces,
};
