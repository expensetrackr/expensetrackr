import * as React from "react";

import * as Button from "./ui/button.tsx";

export function BankConnectionButton(props: Button.ButtonRootProps) {
    const [isLoading, setLoading] = React.useState(false);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        props.onClick?.(e);

        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    return (
        <Button.Root $size="xs" $style="stroke" $type="neutral" disabled={isLoading} {...props} onClick={handleOnClick}>
            Connect
        </Button.Root>
    );
}
