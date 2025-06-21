import AirplaneIcon from "virtual:icons/hugeicons/airplane";
import ArrowLeftRightIcon from "virtual:icons/hugeicons/arrow-left-right";
import BabyIcon from "virtual:icons/hugeicons/baby";
import BankIcon from "virtual:icons/hugeicons/bank";
import BanknoteIcon from "virtual:icons/hugeicons/banknote";
import Briefcase01Icon from "virtual:icons/hugeicons/briefcase-01";
import Car05Icon from "virtual:icons/hugeicons/car-05";
import Chart03Icon from "virtual:icons/hugeicons/chart-03";
import CreditCardIcon from "virtual:icons/hugeicons/credit-card";
import DashboardSquare01Icon from "virtual:icons/hugeicons/dashboard-square-01";
import DeviceMobileIcon from "virtual:icons/hugeicons/device-mobile";
import GiftIcon from "virtual:icons/hugeicons/gift";
import Hammer01Icon from "virtual:icons/hugeicons/hammer-01";
import HandHeartIcon from "virtual:icons/hugeicons/hand-heart";
import Home09Icon from "virtual:icons/hugeicons/home-09";
import KitchenUtensilsIcon from "virtual:icons/hugeicons/kitchen-utensils";
import LicenseDraftIcon from "virtual:icons/hugeicons/license-draft";
import MoreHorizontalCircle01Icon from "virtual:icons/hugeicons/more-horizontal-circle-01";
import PawPrintIcon from "virtual:icons/hugeicons/paw-print";
import PiggyBankIcon from "virtual:icons/hugeicons/piggy-bank";
import Plug01Icon from "virtual:icons/hugeicons/plug-01";
import Pulse02Icon from "virtual:icons/hugeicons/pulse-02";
import ReceiptIcon from "virtual:icons/hugeicons/receipt";
import ReceiptDollarIcon from "virtual:icons/hugeicons/receipt-dollar";
import RepeatIcon from "virtual:icons/hugeicons/repeat";
import ScissorsIcon from "virtual:icons/hugeicons/scissors";
import ShieldIcon from "virtual:icons/hugeicons/shield";
import ShoppingBasket03Icon from "virtual:icons/hugeicons/shopping-basket-03";
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
    cashback: ReceiptDollarIcon,

    // Expense – parent & children
    housing: Home09Icon,
    mortgage: BankIcon,
    repairs: Hammer01Icon,
    transportation: Car05Icon,
    groceries: ShoppingBasket03Icon,
    dining: KitchenUtensilsIcon,
    utilities: Plug01Icon,
    healthcare: Pulse02Icon,
    entertainment: Tv01Icon,
    clothing: TShirtIcon,
    electronics: DeviceMobileIcon,
    "home-services": Wrench01Icon,
    insurance: ShieldIcon,
    taxes: BanknoteIcon,
    subscriptions: ReceiptIcon,
    "child-care": BabyIcon,
    pets: PawPrintIcon,
    charity: HandHeartIcon,
    "personal-care": ScissorsIcon,
    "holidays-travel": AirplaneIcon,
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
