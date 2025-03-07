import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext } = createFormHookContexts();
export const { useAppForm, withForm } = createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
});
