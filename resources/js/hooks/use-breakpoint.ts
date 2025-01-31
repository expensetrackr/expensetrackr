import * as React from "react";

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

type BreakpointKeys = keyof typeof breakpoints;

const useBreakpoint = () => {
    const isBrowser = typeof window !== "undefined";

    const initialState = isBrowser
        ? Object.keys(breakpoints).reduce(
              (acc, key) => ({
                  ...acc,
                  [key]: window.innerWidth >= breakpoints[key as BreakpointKeys],
              }),
              {} as Record<BreakpointKeys, boolean>,
          )
        : ({} as Record<BreakpointKeys, boolean>);

    const [currentBreakpoints, setCurrentBreakpoints] = React.useState(initialState);
    const [prevBreakpoints, setPrevBreakpoints] = React.useState(initialState);

    React.useEffect(() => {
        if (!isBrowser) return undefined;

        const handleResize = () => {
            const windowWidth = window.innerWidth;

            const newBreakpoints = Object.keys(breakpoints).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: windowWidth >= breakpoints[key as BreakpointKeys],
                }),
                {} as Record<BreakpointKeys, boolean>,
            );

            // Check if the current breakpoints are different from the previous ones
            if (JSON.stringify(prevBreakpoints) !== JSON.stringify(newBreakpoints)) {
                setCurrentBreakpoints(newBreakpoints);
                setPrevBreakpoints(newBreakpoints);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [prevBreakpoints, isBrowser]);

    return currentBreakpoints;
};

export default useBreakpoint;
