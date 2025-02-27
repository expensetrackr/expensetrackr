export function PlaceholderLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" height={40} viewBox="0 0 40 40" width={40} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M15.4244 25.3191C15.0551 25.3191 14.71 25.5026 14.5034 25.8087L12.1693 29.2673C11.6713 30.0052 12.2 30.9999 13.0903 30.9999H24.5112C24.8805 30.9999 25.2257 30.8165 25.4322 30.5104L33.8307 18.0659C34.3287 17.328 33.8 16.3333 32.9097 16.3333H25.1826C24.8133 16.3333 24.4681 16.5167 24.2616 16.8228L19.3536 24.0953C18.8371 24.8605 17.9743 25.3191 17.0511 25.3191H15.4244Z"
                fill="url(#paint0_linear_254_5084)"
                opacity="0.48"
            />
            <path
                d="M13.6666 10.0303C14.0743 9.38864 14.7818 9 15.5421 9H24.9773C25.8538 9 26.3852 9.96737 25.915 10.7071L18.3334 22.6364C17.9256 23.278 17.2182 23.6667 16.4579 23.6667H7.02267C6.1462 23.6667 5.61479 22.6993 6.08492 21.9596L13.6666 10.0303Z"
                fill="url(#paint1_linear_254_5084)"
            />
            <defs>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear_254_5084"
                    x1={23}
                    x2={23}
                    y1="16.3333"
                    y2="38.5731"
                >
                    <stop offset="0.313079" stopColor="currentColor" />
                    <stop offset={1} stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint1_linear_254_5084"
                    x1="16.0001"
                    x2="16.0001"
                    y1={9}
                    y2="28.3944"
                >
                    <stop offset="0.38239" stopColor="currentColor" />
                    <stop offset={1} stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
            </defs>
        </svg>
    );
}
