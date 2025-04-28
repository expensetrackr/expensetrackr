import Loading03Icon from "virtual:icons/hugeicons/loading-03";

import { cn } from "#/utils/cn.ts";
import { Button, type ButtonProps } from "./button.tsx";

type SubmitButtonProps = ButtonProps & {
    isSubmitting?: boolean;
};

export function SubmitButton({ children, isSubmitting, type = "submit", ...props }: SubmitButtonProps) {
    return (
        <Button disabled={props.disabled || isSubmitting} type={type} {...props}>
            <span className={cn(isSubmitting && "invisible")}>{children}</span>

            {isSubmitting ? (
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <Loading03Icon className="size-5 animate-spin" />
                </div>
            ) : null}
        </Button>
    );
}
