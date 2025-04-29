import { type FormDataConvertible } from "@inertiajs/core";
import { type InertiaFormProps } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "#/components/button";
import { SubmitButton } from "#/components/submit-button";

interface UseUnsavedChangesProps<TForm extends Record<string, FormDataConvertible>> {
    form: InertiaFormProps<TForm>;
    formId: string;
    onCancel?: () => void;
}

export function useUnsavedChanges<TForm extends Record<string, FormDataConvertible>>({
    form,
    formId,
    onCancel,
}: UseUnsavedChangesProps<TForm>) {
    /**
     * With this ref, we can access the form state from the previous render.
     */
    const formRef = React.useRef(form);

    React.useEffect(() => {
        if (formRef.current && form.isDirty) {
            toast.info("Unsaved changes", {
                id: "unsaved-changes",
                duration: Infinity,
                position: "bottom-center",
                richColors: false,
                cancel: React.createElement(Button, {
                    $size: "xs",
                    $style: "stroke",
                    $type: "neutral",
                    className: "h-7 text-paragraph-xs lg:text-paragraph-sm",
                    onClick: () => {
                        toast.dismiss("unsaved-changes");
                        formRef.current.reset();
                        onCancel?.();
                    },
                    children: "Cancel",
                }),
                action: React.createElement(SubmitButton, {
                    $size: "xs",
                    className: "h-7 text-paragraph-xs lg:text-paragraph-sm",
                    form: formId,
                    isSubmitting: form.processing,
                    type: "submit",
                    children: "Save",
                }),
            });
        }
    }, [form.isDirty, form.processing, formId, onCancel]);

    const dismissUnsavedChanges = React.useCallback(() => {
        toast.dismiss("unsaved-changes");
    }, []);

    return {
        dismissUnsavedChanges,
    };
}
