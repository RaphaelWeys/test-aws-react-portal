import { ConfigProvider } from 'antd';
import enUs from 'antd/lib/locale/en_US';
import esES from 'antd/lib/locale/es_ES';
import frFR from 'antd/lib/locale/fr_FR';
import itIt from 'antd/lib/locale/it_IT';
import nlNl from 'antd/lib/locale/nl_NL';
import i18next from 'i18next';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/nl';
import React, { FC, useState } from 'react';
import { getQueryParameters } from '../utils/url';
import { useUserInfo } from './UserInfoContext';

export type LocalType = 'en' | 'it' | 'fr' | 'es' | 'nl';

export interface ILocalContext {
  local: LocalType;
  setLocal: React.Dispatch<React.SetStateAction<string>>;
}

const LocalContext = React.createContext<ILocalContext | undefined>(undefined);

const LocalProvider: FC = ({ children }) => {
  const { lng } = getQueryParameters();
  const { userInfo } = useUserInfo();
  const { language } = userInfo;
  const [localAnt, setLocalAnt] = useState(undefined);

  React.useEffect(() => {
    if (language === 'it') setLocalAnt(itIt);
    else if (language === 'es') setLocalAnt(esES);
    else if (language === 'fr') setLocalAnt(frFR);
    else if (language === 'nl') setLocalAnt(nlNl);
    else setLocalAnt(enUs);

    moment.locale(language);
    i18next.changeLanguage((lng as string) || language);
  }, [language, lng]);

  if (!localAnt) {
    return null;
  }

  return <ConfigProvider locale={localAnt}>{children}</ConfigProvider>;
};

export { LocalProvider, LocalContext };
