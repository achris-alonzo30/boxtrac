import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformStockText(stockText: string) {
  return stockText
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const currentDate = new Date();

export const currentWeekStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - currentDate.getDay() + 1
);

export const currentWeekEnd = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() + (6 - currentDate.getDay())
);

export const currentMonthStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);

export const currentMonthEnd = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
);

export const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);
export const currentYearEnd = new Date(currentDate.getFullYear(), 11, 31);

export function formatNumber(amount: number) {
  return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
  }).format(amount)
}
