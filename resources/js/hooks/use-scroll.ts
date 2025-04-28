import * as React from "react";

type ScrollPosition = {
    scrollX: number;
    scrollY: number;
};

export function useScroll(): ScrollPosition {
    const [scrollPosition, setScrollPosition] = React.useState<ScrollPosition>({
        scrollX: 0,
        scrollY: 0,
    });

    const handleScroll = () => {
        setScrollPosition({
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        });
    };

    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return scrollPosition;
}
