import { useForm } from "@inertiajs/react";
import * as LabelPrimitives from "@radix-ui/react-label";
import { toast } from "sonner";

import * as Switch from "#/components/ui/switch.tsx";
import { useUser } from "#/hooks/use-user.ts";

type WorkspaceSettingsFormProps = {
    workspaceId: string;
    defaultValues: App.Data.Workspace.WorkspaceSettingsData;
};

export function WorkspaceSettingsForm({ workspaceId, defaultValues }: WorkspaceSettingsFormProps) {
    const form = useForm(defaultValues);
    const user = useUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(route("workspaces.update-settings", [workspaceId, defaultValues.id]), {
            errorBag: "updateWorkspaceSettings",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Workspace settings updated.");
            },
            onError: () => {
                toast.error("Failed to update workspace settings.");
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
                action={route("workspaces.update-settings", [workspaceId, defaultValues.id])}
                className="flex flex-col gap-5"
                id="update-workspace-settings-form"
                method="POST"
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
