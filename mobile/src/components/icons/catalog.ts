import {
  Banknote,
  Car,
  CreditCard,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  PartyPopper,
  PiggyBank,
  Plane,
  Receipt,
  Shirt,
  ShoppingCart,
  Sparkles,
  Tag,
  Utensils,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import type { CategoryKind } from '@/domain/enums';

/** 1:1 Lucide icon for each seeded category (by nameKey). */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cat_food: Utensils,
  cat_groceries: ShoppingCart,
  cat_transport: Car,
  cat_housing: House,
  cat_bills: Receipt,
  cat_fun: PartyPopper,
  cat_clothing: Shirt,
  cat_health: HeartPulse,
  cat_education: GraduationCap,
  cat_gifts: Gift,
  cat_travel: Plane,
  cat_other_exp: Tag,
  cat_salary: Wallet,
  cat_gift_in: Gift,
  cat_other_inc: Sparkles,
};

const ACCOUNT_ICONS: Record<string, LucideIcon> = {
  acc_cash: Banknote,
  acc_card: CreditCard,
  acc_savings: PiggyBank,
};

/** Resolve a category's icon (seeded → mapped; custom → sensible default by kind). */
export function categoryIcon(nameKey: string | null, kind: CategoryKind): LucideIcon {
  if (nameKey && CATEGORY_ICONS[nameKey]) return CATEGORY_ICONS[nameKey];
  return kind === 'INCOME' ? Wallet : Tag;
}

/** Resolve an account's icon (seeded → mapped; custom → wallet). */
export function accountIcon(nameKey: string | null): LucideIcon {
  if (nameKey && ACCOUNT_ICONS[nameKey]) return ACCOUNT_ICONS[nameKey];
  return Wallet;
}

export type { LucideIcon };
