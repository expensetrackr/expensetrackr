const alternateIcon = document.querySelector('link[rel="alternate icon"]') as HTMLLinkElement;
const iconSvg = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement;

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	if (localStorage.theme === "system") {
		if (e.matches) {
			document.documentElement.classList.add("dark");
			document.documentElement.setAttribute("data-theme", "dark");
			alternateIcon.href = "/img/isotype-dark.png";
			iconSvg.href = "/img/isotype-dark.svg";
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.setAttribute("data-theme", "light");
			alternateIcon.href = "/img/isotype-light.png";
			iconSvg.href = "/img/isotype-light.svg";
		}
	}

	updateThemeAndSchemeColor();
});

function updateTheme() {
	if (!("theme" in localStorage)) {
		localStorage.theme = "system";
	}

	switch (localStorage.theme) {
		case "system":
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
				document.documentElement.setAttribute("data-theme", "dark");
				alternateIcon.href = "/img/isotype-dark.png";
				iconSvg.href = "/img/isotype-dark.svg";
			} else {
				document.documentElement.classList.remove("dark");
				document.documentElement.setAttribute("data-theme", "light");
				alternateIcon.href = "/img/isotype-light.png";
				iconSvg.href = "/img/isotype-light.svg";
			}

			document.documentElement.setAttribute("color-theme", "system");
			break;

		case "dark":
			document.documentElement.classList.add("dark");
			document.documentElement.setAttribute("color-theme", "dark");
			document.documentElement.setAttribute("data-theme", "dark");
			alternateIcon.href = "/img/isotype-dark.png";
			iconSvg.href = "/img/isotype-dark.svg";
			break;

		case "light":
			document.documentElement.classList.remove("dark");
			document.documentElement.setAttribute("color-theme", "light");
			document.documentElement.setAttribute("data-theme", "light");
			alternateIcon.href = "/img/isotype-light.png";
			iconSvg.href = "/img/isotype-light.svg";
			break;
	}

	updateThemeAndSchemeColor();
}

function updateThemeAndSchemeColor() {
	if (document.documentElement.classList.contains("dark")) {
		document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", "dark");
		document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#171923");

		return;
	}

	document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", "light");
	document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
}

updateTheme();
