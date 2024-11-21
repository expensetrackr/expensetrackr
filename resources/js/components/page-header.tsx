import { twc } from "#/utils/twc.ts";

const PageHeaderRoot = twc.div`flex flex-col items-start gap-3 py-5 sm:flex-row sm:items-center`;

const PageHeaderContent = twc.div`flex flex-1 items-start gap-3.5`;

const PageHeaderIcon = twc.div`flex size-12 items-center justify-center rounded-full border border-(--stroke-soft-200) bg-(--bg-white-0) text-(--icon-sub-600)`;

const PageHeaderTitle = twc.h1`text-label-lg`;

const PageHeaderDescription = twc.p`text-(--text-sub-600) text-paragraph-sm line-clamp-1`;

const PageHeaderActions = twc.div`flex w-full items-center gap-3 my-auto sm:w-auto`;

export const PageHeader = Object.assign(PageHeaderRoot, {
    Content: PageHeaderContent,
    Icon: PageHeaderIcon,
    Title: PageHeaderTitle,
    Description: PageHeaderDescription,
    Actions: PageHeaderActions,
});
