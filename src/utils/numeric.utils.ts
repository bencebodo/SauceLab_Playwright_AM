import { Locator } from '@playwright/test';

export const parsePrice = (text: string | null | undefined): number => {
    if (!text) return 0;

    const numericPart = text.replace(/[^0-9.]/g, '');
    const result = parseFloat(numericPart);

    return isNaN(result) ? 0 : result;
};

export const getPriceValue = async (locator: Locator): Promise<number> => {
    const text = await locator.textContent();
    return parsePrice(text);
};