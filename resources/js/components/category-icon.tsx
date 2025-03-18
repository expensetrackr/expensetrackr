import BankIcon from "virtual:icons/hugeicons/bank";
import Briefcase01Icon from "virtual:icons/hugeicons/briefcase-01";
import Car05Icon from "virtual:icons/hugeicons/car-05";
import Chart03Icon from "virtual:icons/hugeicons/chart-03";
import DashboardSquare01Icon from "virtual:icons/hugeicons/dashboard-square-01";
import GiftIcon from "virtual:icons/hugeicons/gift";
import Home09Icon from "virtual:icons/hugeicons/home-09";
import KitchenUtensilsIcon from "virtual:icons/hugeicons/kitchen-utensils";
import LaptopIcon from "virtual:icons/hugeicons/laptop";
import MoreHorizontalCircle01Icon from "virtual:icons/hugeicons/more-horizontal-circle-01";
import Mortarboard02Icon from "virtual:icons/hugeicons/mortarboard-02";
import Plug01Icon from "virtual:icons/hugeicons/plug-01";
import Pulse02Icon from "virtual:icons/hugeicons/pulse-02";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import ShoppingBag02Icon from "virtual:icons/hugeicons/shopping-bag-02";
import ShoppingBasket03Icon from "virtual:icons/hugeicons/shopping-basket-03";
import Tv01Icon from "virtual:icons/hugeicons/tv-01";
import Wallet02Icon from "virtual:icons/hugeicons/wallet-02";
import Wrench01Icon from "virtual:icons/hugeicons/wrench-01";

export function CategoryIcon({ category, ...props }: { category: string } & React.SVGProps<SVGSVGElement>) {
    const icons = {
        salary: Wallet02Icon,
        investments: Chart03Icon,
        freelance: Briefcase01Icon,
        gifts: GiftIcon,
        housing: Home09Icon,
        transportation: Car05Icon,
        groceries: ShoppingBasket03Icon,
        dining: KitchenUtensilsIcon,
        utilities: Plug01Icon,
        healthcare: Pulse02Icon,
        entertainment: Tv01Icon,
        shopping: ShoppingBag02Icon,
        education: Mortarboard02Icon,
        technology: LaptopIcon,
        services: Wrench01Icon,
        loans: BankIcon,
        transfer: RepeatIcon,
        other: MoreHorizontalCircle01Icon,
    };
    const Component = icons[category as keyof typeof icons] ?? DashboardSquare01Icon;

    return <Component {...props} />;
}
