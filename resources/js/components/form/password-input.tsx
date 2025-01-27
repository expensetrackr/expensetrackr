import * as React from "react";
import EyeLineIcon from "virtual:icons/ri/eye-line";
import EyeOffLineIcon from "virtual:icons/ri/eye-off-line";

import { Input } from "../composables/input.tsx";

export function PasswordInput(props: React.CustomComponentPropsWithRef<typeof Input>) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Input
            inlineTrailingNode={
                <button onClick={() => setShowPassword((s) => !s)} type="button">
                    {showPassword ? (
                        <EyeOffLineIcon className="text-text-soft-400 size-5 group-has-disabled:text-(--text-disabled-300)" />
                    ) : (
                        <EyeLineIcon className="text-text-soft-400 size-5 group-has-disabled:text-(--text-disabled-300)" />
                    )}
                </button>
            }
            placeholder="••••••••••"
            type={showPassword ? "text" : "password"}
            {...props}
        />
    );
}
