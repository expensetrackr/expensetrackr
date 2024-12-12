import { createTwc } from "react-twc";

import { twMerge } from "./tw-merge.ts";

export const twc = createTwc({
    compose: twMerge,
});
