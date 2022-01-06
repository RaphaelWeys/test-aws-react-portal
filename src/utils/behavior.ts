import i18n from 'i18next';

import { Item } from '../components/Select/Select';
import { COUNTRY_CONFIG } from '../config/app-config';

const i18nCountry = (value: string) => i18n.t(`country-${value}`);

export const i18nItemsForCountry = (): Item[] =>
  COUNTRY_CONFIG.countries.map((country) => ({
    label: i18nCountry(country),
    value: country,
    key: country,
  }));

export const formatStringToBoolean = <T extends { [key: string]: any }>(obj: T): T =>
  Object.keys(obj).reduce((newObj, key) => {
    const value = obj[key];
    return {
      ...newObj,
      [key]: value === 'true' ? true : value === 'false' ? false : value,
    };
  }, {} as T);

export const formatBooleanToString = (obj: { [k: string]: any }) =>
  Object.keys(obj).reduce((newObj, key) => {
    const value = obj[key];
    return {
      ...newObj,
      [key]: value === true ? 'true' : value === false ? 'false' : value,
    };
  }, {});

export const isBoolean = (value: any): boolean => typeof value === 'boolean';

export const isKam = (userInfo) => userInfo.role === 'kam';
export const isManager = (userInfo) => userInfo.role === 'manager';
export const isClient = (userInfo) => userInfo.role === 'client';
export const isMultiAccess = (userInfo) => userInfo.isMultiAccess;
