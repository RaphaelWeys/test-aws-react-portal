import i18next from 'i18next';

export const getCurrencyFormatted = (number: number) =>
  new Intl.NumberFormat(i18next.language, {
    style: 'currency',
    currency: 'EUR',
  }).format(number);
