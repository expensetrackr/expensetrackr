import * as LabelPrimitives from "@radix-ui/react-label";
import * as React from "react";
import Add01Icon from "virtual:icons/hugeicons/add-01";
import UserGroupIcon from "virtual:icons/hugeicons/user-group";

import { type VariantProps } from "#/utils/tv.ts";
import { Image } from "../image.tsx";
import * as Avatar from "../ui/avatar.tsx";
import { type avatarVariants } from "../ui/avatar.tsx";
import * as Button from "../ui/button.tsx";
import * as Checkbox from "../ui/checkbox.tsx";
import * as Divider from "../ui/divider.tsx";
import * as WidgetBox from "../widget-box.tsx";

type Member = {
    id: string;
    name: string;
    color: VariantProps<typeof avatarVariants>["$color"];
    avatar: string;
};

const members: Array<Member> = [
    {
        id: "01jk2dzwvqmqk4sbc2b57fjv8w",
        name: "Ravi Padel",
        color: "gray",
        avatar: "/avatar/memoji/ravi.png",
    },
    {
        id: "01jk2dym95vgxjc93ahksz431g",
        name: "Natalia Sui",
        color: "sky",
        avatar: "/avatar/memoji/natalia.png",
    },
    {
        id: "01jk2e11re8mjgwcbf0s41xh3x",
        name: "Laura Perez",
        color: "purple",
        avatar: "/avatar/memoji/laura.png",
    },
    {
        id: "01jk2e217tqg8afvhmr6f27fy0",
        name: "Sophia Cai",
        color: "yellow",
        avatar: "/avatar/memoji/sophia.png",
    },
    {
        id: "01jk2e31j1s9sh69vnsh2sjjkb",
        name: "Wei Chen",
        color: "gray",
        avatar: "/avatar/memoji/wei.png",
    },
    {
        id: "01jk2e36gd92keqjq2pc90k5ce",
        name: "Juma Modri",
        color: "yellow",
        avatar: "/avatar/memoji/juma.png",
    },
];

export function BentoWorkspaces(props: React.CustomComponentPropsWithRef<typeof WidgetBox.Root>) {
    const [membersSelected, setMembers] = React.useState<string[]>(() => {
        return [...members]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map((member) => member.id);
    });

    return (
        <WidgetBox.Root {...props}>
            <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={UserGroupIcon} />
                Workspace
                <Button.Root $size="xs" $style="stroke" $type="neutral">
                    <Button.Icon as={Add01Icon} />
                    Add
                </Button.Root>
            </WidgetBox.Header>

            <div className="flex flex-col gap-4">
                <Divider.Root />

                <div className="grid grid-cols-2 gap-2">
                    {members.map((member) => (
                        <LabelPrimitives.Root
                            className="group/card flex cursor-pointer items-center gap-3.5 rounded-12 bg-(--bg-white-0) p-2 ring-1 ring-(--stroke-soft-200) transition duration-200 ease-out ring-inset hover:bg-(--bg-weak-50) hover:ring-transparent has-[[data-state=checked]]:ring-primary"
                            key={member.id}
                        >
                            <Avatar.Root $color={member.color} $size="40">
                                <Avatar.Image asChild>
                                    <Image alt={member.name} height={40} isCdn src={member.avatar} width={40} />
                                </Avatar.Image>
                            </Avatar.Root>
                            <div className="flex-1 space-y-1">
                                <div className="line-clamp-1 text-label-xs">{member.name}</div>
                            </div>
                            <Checkbox.Root
                                checked={membersSelected.includes(member.id)}
                                id={member.id}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setMembers((prev) => [...prev, member.id]);
                                    } else {
                                        setMembers((prev) => prev.filter((id) => id !== member.id));
                                    }
                                }}
                                value={member.id}
                            />
                        </LabelPrimitives.Root>
                    ))}
                </div>

                <Button.Root $size="sm" $type="neutral">
                    Save changes
                </Button.Root>
            </div>
        </WidgetBox.Root>
    );
}
