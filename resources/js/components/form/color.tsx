import * as React from "react";
import { Input as AriaInput, getColorChannels, type Color, type ColorSpace } from "react-aria-components";

import { cn } from "#/utils/cn.ts";
import * as Button from "../ui/button.tsx";
import * as ColorPicker from "../ui/color-picker.tsx";
import * as Divider from "../ui/divider.tsx";
import * as Hint from "../ui/hint.tsx";
import * as Input from "../ui/input.tsx";
import * as Label from "../ui/label.tsx";
import * as Popover from "../ui/popover.tsx";
import * as Select from "../ui/select.tsx";

export const colorSwatches = [
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

type ColorFieldProps = Omit<React.ComponentPropsWithRef<"input">, "value"> & {
    wrapperClassName?: string;
    label?: string;
    hiddenLabel?: boolean;
    hint?: string | Array<string> | Array<undefined>;
    error?: string | Array<string>;
    color?: string;
    onColorChange?: (value: string) => void;
};

export function ColorField({
    wrapperClassName,
    label,
    hiddenLabel,
    hint,
    error,
    color,
    onColorChange,
    ...rest
}: ColorFieldProps) {
    const generatedId = React.useId();
    const id = rest.id || generatedId;
    const [space, setSpace] = React.useState<ColorSpace | "hex">("hex");

    const handleChange = (value: Color) => {
        onColorChange?.(value.toString("hex"));
    };

    return (
        <div className={cn("flex flex-col gap-1", wrapperClassName)}>
            {label ? (
                <Label.Root className={cn({ "sr-only": hiddenLabel })} disabled={rest.disabled} htmlFor={id}>
                    {label}
                </Label.Root>
            ) : null}

            <input
                aria-describedby={[error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                aria-invalid={error ? true : undefined}
                id={`${id}-input`}
                type="hidden"
                value={color}
                {...rest}
            />

            <ColorPicker.Root onChange={handleChange} value={color}>
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <Button.Root $style="stroke" $type="neutral" id={id}>
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
                            <div className="text-paragraph-xs text-(--text-sub-600)">Recommended Colors</div>
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

            {error || hint ? (
                <Hint.Root
                    $disabled={rest.disabled}
                    $error={!!error}
                    id={[error && `${id}-error`, `${id}-description`].filter(Boolean).join(" ")}
                >
                    <Hint.Icon />
                    {error || hint}
                </Hint.Root>
            ) : null}
        </div>
    );
}
