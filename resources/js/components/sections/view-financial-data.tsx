import TableIcon from "virtual:icons/hugeicons/table";
import { Image } from "../image.tsx";

export function ViewFinancialDataSection() {
    return (
        <section id="view-financial-data">
            <div className="container overflow-hidden border-x border-t bg-(--bg-white-0) py-12 lg:px-12">
                <div className="mx-auto max-w-xl text-center">
                    <p className="flex items-center justify-center gap-2">
                        <TableIcon className="size-4 text-primary" />
                        <span className="text-paragraph-sm font-medium text-(--text-sub-600) uppercase">
                            see everything clearly
                        </span>
                    </p>

                    <h3 className="mt-8 text-h4 font-bold tracking-tight">A Clear View of Your Money</h3>
                    <p className="mt-2 text-paragraph-lg text-(--text-sub-600)">
                        Effortlessly <strong>view</strong>, <strong>sort</strong>, <strong>filter</strong>, and{" "}
                        <strong>analyze</strong> your expenses, budgets, investments, and assets to make smarter
                        decisions.
                    </p>
                </div>

                <div className="relative pt-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Image
                            alt="Dashboard Transactions"
                            className="mb-[-12%] rounded-12 pt-4 shadow-2xl outline outline-(--stroke-soft-200)"
                            height={2118}
                            isCdn
                            src="/img/transactions-showcase.png"
                            width={3416}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
