import DOMPurify from "dompurify";

let purify: ReturnType<typeof DOMPurify>;

if (typeof window === "undefined") {
    const { JSDOM } = await import("jsdom");
    purify = DOMPurify(new JSDOM("").window);
} else {
    purify = DOMPurify(window);
}

export { purify };
