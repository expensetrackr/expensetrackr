import { useState, useCallback } from "react";

export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, []);

    return { copied, copyToClipboard };
}
