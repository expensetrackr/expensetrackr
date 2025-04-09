import { router } from "@inertiajs/react";
import GlobalIcon from "virtual:icons/ri/global-line";

import { usePageProps } from "#/hooks/use-page-props.ts";
import { routes } from "#/routes.ts";
import * as Select from "./ui/select.tsx";

export function LanguageSelect(props: React.CustomComponentPropsWithRef<typeof Select.Root>) {
    const page = usePageProps().props;

    const handleChange = (value: string) => {
        router.post(routes.language.store.url(), { language: value });
    };

    return (
        <Select.Root
            $variant="inline"
            defaultValue={page.language ?? undefined}
            onValueChange={handleChange}
            {...props}
        >
            <Select.Trigger>
                <Select.TriggerIcon as={GlobalIcon} />
                <Select.Value placeholder="Select Language" />
            </Select.Trigger>
            <Select.Content>
                {page.languages?.map((lang) => (
                    <Select.Item key={lang.code} value={lang.code}>
                        {lang.name}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}
