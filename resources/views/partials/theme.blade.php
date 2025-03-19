<script>
    const alternateIcon = document.querySelector('link[rel="alternate icon"]');
    const iconSvg = document.querySelector('link[rel="icon"][type="image/svg+xml"]');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.theme === 'system') {
            if (e.matches) {
                alternateIcon.href = '/img/isotype-dark.png';
                iconSvg.href = '/img/isotype-dark.svg';
            } else {
                alternateIcon.href = '/img/isotype-light.png';
                iconSvg.href = '/img/isotype-light.svg';
            }
        }

        updateThemeAndSchemeColor();
    });

    function updateTheme() {
        if (!('theme' in localStorage)) {
            localStorage.theme = 'system';
        }

        switch (localStorage.theme) {
            case 'system':
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    alternateIcon.href = '/img/isotype-dark.png';
                    iconSvg.href = '/img/isotype-dark.svg';
                } else {
                    alternateIcon.href = '/img/isotype-light.png';
                    iconSvg.href = '/img/isotype-light.svg';
                }
                break;

            case 'dark':
                alternateIcon.href = '/img/isotype-dark.png';
                iconSvg.href = '/img/isotype-dark.svg';
                break;

            case 'light':
                alternateIcon.href = '/img/isotype-light.png';
                iconSvg.href = '/img/isotype-light.svg';
                break;
        }

        updateThemeAndSchemeColor();
    }

    function updateThemeAndSchemeColor() {
        if (document.documentElement.classList.contains('dark')) {
            document.querySelector('meta[name="color-scheme"]').setAttribute('content', 'dark');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#171923');

            return;
        }

        document.querySelector('meta[name="color-scheme"]').setAttribute('content', 'light');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
    }

    updateTheme();
</script>
