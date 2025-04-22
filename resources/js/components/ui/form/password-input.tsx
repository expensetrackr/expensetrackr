import * as React from "react";
import ViewIcon from "virtual:icons/hugeicons/view";
import ViewOffSlashIcon from "virtual:icons/hugeicons/view-off-slash";

import { TextField } from "./text-field.tsx";

export function PasswordInput(props: React.CustomComponentPropsWithRef<typeof TextField>) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <TextField
            inlineTrailingNode={
                <button onClick={() => setShowPassword((s) => !s)} type="button">
                    {showPassword ? (
                        <ViewOffSlashIcon className="size-5 text-(--text-soft-400) group-has-disabled:text-(--text-disabled-300)" />
                    ) : (
                        <ViewIcon className="size-5 text-(--text-soft-400) group-has-disabled:text-(--text-disabled-300)" />
                    )}
                </button>
            }
            placeholder="••••••••••"
            type={showPassword ? "text" : "password"}
            {...props}
        />
    );
}
