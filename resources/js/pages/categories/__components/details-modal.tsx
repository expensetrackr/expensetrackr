import { useForm } from "@inertiajs/react";
import * as React from "react";
import { Input as AriaInput, type ColorSpace, getColorChannels } from "react-aria-components";

import { TextField } from "#/components/form/text-field.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as ColorPicker from "#/components/ui/color-picker.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import * as Input from "#/components/ui/input.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import * as Popover from "#/components/ui/popover.tsx";
import * as Select from "#/components/ui/select.tsx";
import { useCategoriesParams } from "#/hooks/use-categories-params.ts";
import { cn } from "#/utils/cn.ts";

const colorSwatches = [
    "#717784", // neutral-500
    "#335CFF", // blue-500
    "#FF9147", // orange-500
    "#FB3748", // red-500
    "#1FC16B", // green-500
    "#F6B51E", // yellow-500
    "#7D52F4", // purple-500
    "#47C2FF", // sky-500
    "#FB4BA3", // pink-500
    "#22D3BB", // teal-500
];

type DetailsModalProps = {
    category: Resources.Category;
};

export function DetailsModal({ category }: DetailsModalProps) {
    const { categoryId, setParams } = useCategoriesParams();
    const form = useForm({
        name: category.name,
        color: category.color,
    });
    const [space, setSpace] = React.useState<ColorSpace | "hex">("hex");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(route("categories.update", [category?.id ?? ""]), {
            errorBag: "updateCategory",
            preserveScroll: true,
            async onSuccess() {
                await setParams({ categoryId: null });
            },
            onError() {
                form.reset();
            },
        });
    };

    return (
        <Modal.Root onOpenChange={() => setParams({ categoryId: null })} open={!!categoryId}>
            <Modal.Content className="max-w-[440px]">
                <Modal.Body className="flex items-start gap-4">
                    <form
                        action={route("categories.update", [category?.id ?? ""])}
                        className="flex w-full flex-col gap-3"
                        id="update-category-form"
                        method="POST"
                        onSubmit={onSubmit}
                    >
                        <input name="_method" type="hidden" value="PUT" />

                        <TextField
                            $error={!!form.errors.name}
                            autoComplete="off"
                            autoFocus
                            disabled={form.processing}
                            hint={form.errors.name}
                            label="Name"
                            name="name"
                            onChange={(e) => form.setData("name", e.target.value)}
                            placeholder="Groceries"
                            type="text"
                            value={form.data.name}
                        />

                        <ColorPicker.Root
                            onChange={(value) => form.setData("color", value.toString("hex"))}
                            value={form.data.color}
                        >
                            <Popover.Root>
                                <Popover.Trigger asChild>
                                    <Button.Root $style="stroke" $type="neutral">
                                        <Button.Icon as={ColorPicker.Swatch} className="rounded-4" />
                                        Choose color
                                    </Button.Root>
                                </Popover.Trigger>

                                <Popover.Content className="flex w-[272px] flex-col gap-3 rounded-16 bg-(--bg-white-0) p-4 shadow-md ring-1 ring-(--stroke-soft-200) ring-inset">
                                    <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                                        <ColorPicker.Thumb className="ring-white" />
                                    </ColorPicker.Area>

                                    <ColorPicker.Slider channel="hue" colorSpace="hsl">
                                        <ColorPicker.SliderTrack>
                                            <ColorPicker.Thumb className="top-1/2" />
                                        </ColorPicker.SliderTrack>
                                    </ColorPicker.Slider>

                                    <div className="flex flex-col items-start gap-1">
                                        <Select.Root
                                            $variant="inline"
                                            aria-label="Color Space"
                                            onValueChange={(s) => setSpace(s as ColorSpace)}
                                            value={space}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Content aria-label="items">
                                                <Select.Item id="hex" value="hex">
                                                    HEX
                                                </Select.Item>
                                                <Select.Item id="rgb" value="rgb">
                                                    RGB
                                                </Select.Item>
                                                <Select.Item id="hsl" value="hsl">
                                                    HSL
                                                </Select.Item>
                                                <Select.Item id="hsb" value="hsb">
                                                    HSB
                                                </Select.Item>
                                            </Select.Content>
                                        </Select.Root>

                                        <div className="flex w-full -space-x-px">
                                            <ColorPicker.EyeDropperButton />
                                            <div className="flex -space-x-px">
                                                {space === "hex" ? (
                                                    <Input.Root
                                                        $size="xs"
                                                        asChild
                                                        className="flex-[3] rounded-r-none focus-within:z-10 hover:[&:not(:focus-within)]:before:!ring-(--stroke-soft-200)"
                                                    >
                                                        <ColorPicker.Field colorSpace="hsb">
                                                            <Input.Wrapper>
                                                                <Input.Input asChild>
                                                                    <AriaInput />
                                                                </Input.Input>
                                                            </Input.Wrapper>
                                                        </ColorPicker.Field>
                                                    </Input.Root>
                                                ) : (
                                                    getColorChannels(space).map((channel, index) => (
                                                        <Input.Root
                                                            $size="xs"
                                                            asChild
                                                            className={cn(
                                                                "flex-1 focus-within:z-10 hover:[&:not(:focus-within)]:before:!ring-(--stroke-soft-200)",
                                                                index === 0 ? "rounded-r-none" : "rounded-none",
                                                            )}
                                                            key={channel}
                                                        >
                                                            <ColorPicker.Field channel={channel} colorSpace={space}>
                                                                <Input.Wrapper>
                                                                    <Input.Input asChild>
                                                                        <AriaInput aria-label={channel.toString()} />
                                                                    </Input.Input>
                                                                </Input.Wrapper>
                                                            </ColorPicker.Field>
                                                        </Input.Root>
                                                    ))
                                                )}
                                                <Input.Root
                                                    $size="xs"
                                                    asChild
                                                    className="flex-1 rounded-l-none focus-within:z-10 hover:[&:not(:focus-within)]:before:!ring-(--stroke-soft-200)"
                                                >
                                                    <ColorPicker.Field channel="alpha">
                                                        <Input.Wrapper>
                                                            <Input.Input asChild>
                                                                <AriaInput aria-label="Alpha" />
                                                            </Input.Input>
                                                        </Input.Wrapper>
                                                    </ColorPicker.Field>
                                                </Input.Root>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider.Root className="-mx-4 my-1 w-auto" />

                                    <div className="flex flex-col gap-2">
                                        <div className="text-paragraph-xs text-(--text-sub-600)">
                                            Recommended Colors
                                        </div>
                                        <ColorPicker.SwatchPicker>
                                            {colorSwatches.map((color) => (
                                                <ColorPicker.SwatchPickerItem color={color} key={color}>
                                                    <ColorPicker.Swatch
                                                        style={{
                                                            ["--tw-ring-color" as any]: color,
                                                        }}
                                                    />
                                                </ColorPicker.SwatchPickerItem>
                                            ))}
                                        </ColorPicker.SwatchPicker>
                                    </div>
                                </Popover.Content>
                            </Popover.Root>
                        </ColorPicker.Root>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => setParams({ categoryId: null })}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        className="w-full"
                        disabled={form.processing}
                        form="update-category-form"
                        type="submit"
                    >
                        {form.processing ? "Saving..." : "Save"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
