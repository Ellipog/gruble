import Cookies from "js-cookie";

export interface Category {
  id: number;
  category: string;
}

export interface CategoryList {
  title: string;
  categories: Category[];
}

export interface CustomList extends CategoryList {
  id: string;
}

export interface CustomCategories {
  [key: string]: CustomList;
}

const CUSTOM_CATEGORIES_COOKIE = "gruble_custom_categories";

export const loadCustomCategories = (): CustomCategories => {
  const stored = Cookies.get(CUSTOM_CATEGORIES_COOKIE);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

export const saveCustomCategories = (categories: CustomCategories): void => {
  Cookies.set(CUSTOM_CATEGORIES_COOKIE, JSON.stringify(categories), {
    expires: 365,
  });
};

export const generateCustomListId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createCustomList = (
  title: string,
  categories: { category: string }[]
): CustomList => {
  return {
    id: generateCustomListId(),
    title,
    categories: categories.map((cat, index) => ({
      id: index + 1,
      category: cat.category,
    })),
  };
};
