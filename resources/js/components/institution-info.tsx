import * as Tooltip from "./ui/tooltip.tsx";

type Props = {
    provider: string;
    children: React.ReactNode;
};

export function InstitutionInfo({ provider, children }: Props) {
    const getDescription = () => {
        switch (provider) {
            case "teller":
                return "Connect instantly to more than 7,000 financial institutions in the US.";
            default:
                break;
        }
    };

    return (
        <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
            <Tooltip.Content $size="sm" side="right">
                {getDescription()}
            </Tooltip.Content>
        </Tooltip.Root>
    );
}
