import Loading03Icon from "virtual:icons/hugeicons/loading-03";

import { cn } from "#/utils/cn.ts";
import * as Button from "./ui/button.tsx";

type SubmitButtonProps = Button.ButtonRootProps & {
    isSubmitting?: boolean;
};

export function SubmitButton({ children, isSubmitting, ...props }: SubmitButtonProps) {
    return (
        <Button.Root disabled={props.disabled || isSubmitting} {...props}>
            <span className={cn(isSubmitting && "invisible")}>{children}</span>

            {isSubmitting ? (
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <Loading03Icon className="size-5 animate-spin" />
                </div>
            ) : null}
        </Button.Root>
    );
}
