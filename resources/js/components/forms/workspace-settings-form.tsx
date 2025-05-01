import { useForm } from "@inertiajs/react";
import { Label as LabelPrimitives } from "radix-ui";
import { toast } from "sonner";

import * as Switch from "#/components/ui/switch.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { routes } from "#/routes.ts";

type WorkspaceSettingsFormProps = {
    workspaceId: string;
    defaultValues: App.Data.Workspace.WorkspaceSettingsData;
};

/**
 * Renders a form for updating workspace settings, including toggling transaction enrichment.
 *
 * Displays current workspace settings and allows users with an active subscription to enable or disable transaction enrichment. Submits changes via Inertia.js and provides success or error notifications.
 *
 * @param workspaceId - The unique identifier of the workspace being updated.
 * @param defaultValues - The initial settings data for the workspace.
 *
 * @remark The transaction enrichment option is only available to subscribed users. All enrichment is performed in English.
 */
export function WorkspaceSettingsForm({ workspaceId, defaultValues }: WorkspaceSettingsFormProps) {
    const form = useForm(defaultValues);
    const user = useUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(routes.workspaces.updateSettings.url({ workspace: workspaceId, settings: defaultValues.id }), {
            errorBag: "updateWorkspaceSettings",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Workspace settings updated.", {
                    id: "workspace-settings-update-success",
                });
            },
            onError: () => {
                toast.error("Failed to update workspace settings.", {
                    id: "workspace-settings-update-error",
                });
                form.reset();
            },
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,26fr)_minmax(0,37fr)]">
            <div>
                <div className="text-label-sm">General Settings</div>
                <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">Configure your workspace settings.</div>
            </div>
            <form
                {...routes.workspaces.updateSettings.form({ workspace: workspaceId, settings: defaultValues.id })}
                className="flex flex-col gap-5"
                id="update-workspace-settings-form"
                onSubmit={onSubmit}
            >
                <input name="_method" type="hidden" value="PUT" />

                <div className="flex items-start gap-2">
                    <Switch.Root
                        checked={form.data.isDataEnrichmentEnabled}
                        data-auto-submit
                        disabled={!user.isSubscribed || form.processing}
                        id="transaction-enrichment"
                        onCheckedChange={(checked) => form.setData("isDataEnrichmentEnabled", checked)}
                    />
                    <LabelPrimitives.Root className="cursor-pointer" htmlFor="transaction-enrichment">
                        <div className="text-label-sm">Transaction Enrichment</div>
                        <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">
                            Automatically enrich transactions with additional information using FinanceCore (our
                            internal API). <i>All enrichments are made in English.</i>
                        </div>
                        <div className="mt-1 text-paragraph-xs text-(--text-sub-600)">
                            <i>Requires a paid plan.</i>
                        </div>
                    </LabelPrimitives.Root>
                </div>
            </form>
        </div>
    );
}
