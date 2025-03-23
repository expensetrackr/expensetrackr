import { LanguageSelect } from "#/components/language-select.tsx";

export function AuthFooter() {
    return (
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between p-6">
            <div className="space-x-1 text-paragraph-sm text-(--text-sub-600)">
                <span>© {new Date().getFullYear()}</span>
                <span>ExpenseTrackr</span>
            </div>

            <LanguageSelect />
        </div>
    );
}
