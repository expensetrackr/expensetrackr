import * as React from "react";

export function IconEmptyUser(props: React.SVGProps<SVGSVGElement>) {
    const clipPathId = React.useId();

    return (
        <svg fill="none" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath={`url(#${clipPathId})`} fill="#fff">
                <ellipse cx={40} cy={78} fillOpacity={0.72} rx={32} ry={24} />
                <circle cx={40} cy={32} opacity={0.9} r={16} />
            </g>
            <defs>
                <clipPath id={clipPathId}>
                    <rect fill="#fff" height={80} rx={40} width={80} />
                </clipPath>
            </defs>
        </svg>
    );
}

export function IconEmptyCompany(props: React.SVGProps<SVGSVGElement>) {
    const clipPathId = React.useId();
    const filterId1 = React.useId();
    const filterId2 = React.useId();

    return (
        <svg fill="none" height={56} viewBox="0 0 56 56" width={56} xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath={`url(#${clipPathId})`}>
                <rect className="fill-(--bg-soft-200)" height={56} rx={28} width={56} />
                <path className="fill-(--bg-soft-200)" d="M0 0h56v56H0z" />
                <g filter={`url(#${filterId1})`} opacity={0.48}>
                    <path
                        d="M7 24.9a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 017 73.9v-49z"
                        fill="#fff"
                    />
                </g>
                <path
                    className="fill-(--bg-soft-200)"
                    d="M12.6 28.7a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z"
                />
                <g filter={`url(#${filterId2})`}>
                    <path
                        d="M21 14a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 0121 63V14z"
                        fill="#fff"
                        fillOpacity={0.8}
                    />
                </g>
                <path
                    className="fill-(--bg-soft-200)"
                    d="M26.6 17.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm9.8-29.4a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z"
                />
            </g>
            <defs>
                <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height={62.6}
                    id={filterId1}
                    width={34.6}
                    x={3}
                    y={18.1}
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation={2} />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_36237_4888" />
                    <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_36237_4888" result="shape" />
                </filter>
                <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height={70.6}
                    id={filterId2}
                    width={42.6}
                    x={13}
                    y={3.2}
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation={4} />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_36237_4888" />
                    <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_36237_4888" result="shape" />
                    <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                    <feBlend in2="shape" result="effect2_innerShadow_36237_4888" />
                </filter>
                <clipPath id={clipPathId}>
                    <rect fill="#fff" height={56} rx={28} width={56} />
                </clipPath>
            </defs>
        </svg>
    );
}
