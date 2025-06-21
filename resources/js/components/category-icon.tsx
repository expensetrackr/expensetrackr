import AirplaneTakeOff01Icon from "virtual:icons/hugeicons/airplane-take-off-01";
import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import Baby02Icon from "virtual:icons/hugeicons/baby-02";
import BankIcon from "virtual:icons/hugeicons/bank";
import Briefcase01Icon from "virtual:icons/hugeicons/briefcase-01";
import Car05Icon from "virtual:icons/hugeicons/car-05";
import CashbackIcon from "virtual:icons/hugeicons/cashback";
import CharityIcon from "virtual:icons/hugeicons/charity";
import Chart03Icon from "virtual:icons/hugeicons/chart-03";
import CreditCardIcon from "virtual:icons/hugeicons/credit-card";
import DashboardSquare01Icon from "virtual:icons/hugeicons/dashboard-square-01";
import FishFoodIcon from "virtual:icons/hugeicons/fish-food";
import GiftIcon from "virtual:icons/hugeicons/gift";
import Home09Icon from "virtual:icons/hugeicons/home-09";
import Invoice01Icon from "virtual:icons/hugeicons/invoice-01";
import Invoice03Icon from "virtual:icons/hugeicons/invoice-03";
import KitchenUtensilsIcon from "virtual:icons/hugeicons/kitchen-utensils";
import LicenseDraftIcon from "virtual:icons/hugeicons/license-draft";
import MoreHorizontalCircle01Icon from "virtual:icons/hugeicons/more-horizontal-circle-01";
import PiggyBankIcon from "virtual:icons/hugeicons/piggy-bank";
import Plug01Icon from "virtual:icons/hugeicons/plug-01";
import PolicyIcon from "virtual:icons/hugeicons/policy";
import Pulse02Icon from "virtual:icons/hugeicons/pulse-02";
import RepairIcon from "virtual:icons/hugeicons/repair";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import ScissorIcon from "virtual:icons/hugeicons/scissor";
import ShoppingBasket03Icon from "virtual:icons/hugeicons/shopping-basket-03";
import SmartPhone01Icon from "virtual:icons/hugeicons/smart-phone-01";
import TShirtIcon from "virtual:icons/hugeicons/t-shirt";
import Tv01Icon from "virtual:icons/hugeicons/tv-01";
import Wallet02Icon from "virtual:icons/hugeicons/wallet-02";
import Wrench01Icon from "virtual:icons/hugeicons/wrench-01";

export const categoryIcons = {
    // Income
    salary: Wallet02Icon,
    investments: Chart03Icon,
    freelance: Briefcase01Icon,
    gifts: GiftIcon,
    refunds: RepeatIcon,
    "rental-income": Home09Icon,
    royalties: LicenseDraftIcon,
    cashback: CashbackIcon,

    // Expense – parent & children
    housing: Home09Icon,
    mortgage: BankIcon,
    repairs: RepairIcon,
    transportation: Car05Icon,
    groceries: ShoppingBasket03Icon,
    dining: KitchenUtensilsIcon,
    utilities: Plug01Icon,
    healthcare: Pulse02Icon,
    entertainment: Tv01Icon,
    clothing: TShirtIcon,
    electronics: SmartPhone01Icon,
    "home-services": Wrench01Icon,
    insurance: PolicyIcon,
    taxes: Invoice03Icon,
    subscriptions: Invoice01Icon,
    "child-care": Baby02Icon,
    pets: FishFoodIcon,
    charity: CharityIcon,
    "personal-care": ScissorIcon,
    "holidays-travel": AirplaneTakeOff01Icon,
    "debt-payments": CreditCardIcon,

    // Savings & misc
    savings: PiggyBankIcon,
    transfer: ArrowLeftRightIcon,
    other: MoreHorizontalCircle01Icon,
};

export function CategoryIcon({ category, ...props }: { category?: string } & React.SVGProps<SVGSVGElement>) {
    const Component = categoryIcons[category as keyof typeof categoryIcons] ?? DashboardSquare01Icon;

    return <Component {...props} />;
}
