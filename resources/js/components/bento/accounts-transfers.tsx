import useEmblaCarousel from "embla-carousel-react";
import { CurrencyInput } from "headless-currency-input";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import ArrowDownSIcon from "virtual:icons/ri/arrow-down-s-line";
import ArrowLeftRightIcon from "virtual:icons/ri/arrow-left-right-line";
import ArrowLeftSIcon from "virtual:icons/ri/arrow-left-s-line";
import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import CheckboxCircleFillIcon from "virtual:icons/ri/checkbox-circle-fill";
import SendPlaneFillIcon from "virtual:icons/ri/send-plane-fill";
import Settings4Icon from "virtual:icons/ri/settings-4-line";

import * as Button from "#/components/ui/button.tsx";
import * as CompactButton from "#/components/ui/compact-button.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as WidgetBox from "#/components/widget-box.tsx";
import { cnMerge } from "#/utils/cn.ts";
import { Image } from "../image.tsx";

type Account = {
    id: string;
    name: string;
};

const accountsList: Array<Account> = [
    {
        id: "1",
        name: "PayBuddy",
    },
    {
        id: "2",
        name: "Bank of Atlanta",
    },
    {
        id: "3",
        name: "Chaste",
    },
    {
        id: "4",
        name: "Capital First",
    },
    {
        id: "5",
        name: "Pear Card",
    },
    {
        id: "6",
        name: "Search Pay",
    },
    {
        id: "7",
        name: "Nova Bank",
    },
    {
        id: "8",
        name: "Nova Bank 2",
    },
];

type AccountPillProps = React.ComponentPropsWithRef<"button"> & {
    account: Account;
    selected?: boolean;
};

function AccountPill({ account, selected, className, ref, ...rest }: AccountPillProps) {
    return (
        <button
            className={cnMerge(
                "flex h-8 min-w-auto items-center rounded-full bg-(--bg-white-0) px-3 whitespace-nowrap ring-1 ring-(--stroke-soft-200) transition duration-200 ease-out outline-none ring-inset",
                selected ? "bg-(--bg-weak-50)" : "hover:bg-(--bg-weak-50) hover:ring-transparent",
                className,
            )}
            type="button"
            {...rest}
        >
            <div
                className={cnMerge(
                    selected ? "text-label-sm text-(--text-strong-950)" : "text-paragraph-sm text-(--text-sub-600)",
                )}
            >
                {account.name}
            </div>
            <AnimatePresence>
                {selected && (
                    <motion.div
                        animate={{
                            width: "auto",
                            scale: 1,
                            transition: {
                                width: { duration: 0.1 },
                                scale: { duration: 0.25 },
                            },
                        }}
                        className="overflow-hidden"
                        exit={{ width: 0, scale: 0 }}
                        initial={{ width: 0, scale: 0 }}
                    >
                        <div className="pl-1.5">
                            <CheckboxCircleFillIcon className="size-4 text-state-success-base" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

export function BentoAccountsTransfers(props: React.CustomComponentPropsWithRef<typeof WidgetBox.Root>) {
    const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>(["1", "3"]);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
    });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [amount, setAmount] = React.useState("0");

    React.useEffect(() => {
        if (!emblaApi) return;

        const updateButtonStates = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };

        emblaApi.on("select", updateButtonStates);
        updateButtonStates(); // Initial update on mount
    }, [emblaApi]);

    const toggleAccountSelection = (id: string) => {
        setSelectedAccounts((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((accountId) => accountId !== id) : [...prevSelected, id],
        );
    };

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    return (
        <WidgetBox.Root {...props}>
            <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={ArrowLeftRightIcon} />
                Quick Transfer
                <Button.Root $size="xs" $style="stroke" $type="neutral">
                    <Button.Icon as={Settings4Icon} />
                    Advanced
                </Button.Root>
            </WidgetBox.Header>

            <div className="flex flex-col gap-4">
                <Divider.Root />

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-subheading-xs text-(--text-soft-400) uppercase">
                            My Accounts ({accountsList.length})
                        </div>
                        <div className="flex gap-2">
                            <CompactButton.Root
                                $size="md"
                                $style="ghost"
                                disabled={!canScrollPrev}
                                onClick={scrollPrev}
                            >
                                <CompactButton.Icon as={ArrowLeftSIcon} />
                            </CompactButton.Root>
                            <CompactButton.Root
                                $size="md"
                                $style="ghost"
                                disabled={!canScrollNext}
                                onClick={scrollNext}
                            >
                                <CompactButton.Icon as={ArrowRightSIcon} />
                            </CompactButton.Root>
                        </div>
                    </div>

                    <div className="-mx-[15px] overflow-hidden px-[15px]" ref={emblaRef}>
                        <div className="flex gap-2">
                            {accountsList.map((account) => (
                                <AccountPill
                                    account={account}
                                    key={account.id}
                                    onClick={() => toggleAccountSelection(account.id)}
                                    selected={selectedAccounts.includes(account.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-10 bg-(--bg-white-0) ring-1 ring-(--stroke-soft-200) ring-inset before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:ring-1 before:ring-(--stroke-soft-200) before:ring-inset">
                    <div className="flex h-8 items-center justify-between gap-2 border-b bg-(--bg-weak-50) pr-2.5 pl-3">
                        <div className="flex items-center gap-2">
                            <Image
                                alt="MasterCard"
                                className="size-5 shrink-0"
                                height={20}
                                isCdn
                                src="/major-brands/mastercard.svg"
                                width={20}
                            />
                            <div className="text-paragraph-sm text-(--text-sub-600)">Fast Pay</div>
                        </div>
                        <ArrowDownSIcon className="size-5 shrink-0 text-(--text-sub-600)" />
                    </div>
                    <div className="flex flex-col items-center gap-3.5 p-2">
                        <div>
                            <div className="pt-1.5 text-center text-subheading-2xs text-(--text-soft-400)">
                                ENTER AMOUNT
                            </div>
                            <div className="mt-1 flex justify-center">
                                <CurrencyInput
                                    className="text-center text-h4 tabular-nums outline-none"
                                    maxLength={11}
                                    onValueChange={(values) => setAmount(values.value)}
                                    value={amount}
                                />
                            </div>
                        </div>
                        <div className="rounded-md flex h-7 w-full items-center justify-center bg-(--bg-weak-50)">
                            <div className="text-paragraph-xs text-(--text-sub-600)">
                                Available: <span className="font-medium text-(--text-strong-950)">$16,058.94</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button.Root $size="sm" $type="neutral" disabled={amount === "0" || amount === "0.00"}>
                    Transfer to account
                    <Button.Icon as={SendPlaneFillIcon} />
                </Button.Root>
            </div>
        </WidgetBox.Root>
    );
}
