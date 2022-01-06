export interface ClientMarkets {
  country: string;
  energy: string;
  enabled: boolean;
  periodStart: string;
  periodEnd: string;
  marketTrendsPartner: boolean;
  marketTrendsCompany: boolean;
  marketTrendsUser: boolean;
  hasCompanyMarketTrend: boolean;
  contracts: number;
}

export interface MultiAccessClientUser {
  role: string;
  tenant: string;
  _id: string;
  id: string;
  phone: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  multiaccess: MultiAccessMultiAccessForm;
}

export interface MultiAccessClient {
  user: MultiAccessClientUser;
  multiAccessForYop: boolean;
  multiAccessForMarketplace: boolean;
}

// KAM

export interface MultiAccessKamUser {
  role: string;
  tenant: string;
  _id: string;
  id: string;
  phone: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  multiaccess: {
    contracts: number;
  };
}

export interface MultiAccessKam {
  user: MultiAccessKamUser;
  multiAccessForYop: boolean;
  multiAccessForMarketplace: boolean;
}

// LIST

export interface MultiAccessMultiAccessForm {
  clientReference?: string;
  isDailyAccount: boolean;
  contractsManagedBy: 'kam' | 'client';
  clientCanLogin: boolean;
  clientMarkets: ClientMarkets[];
}

export interface MultiAccessList {
  role: string;
  tenant: string;
  _id: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
  multiaccess: {
    clientCanLogin: boolean;
    clientMarkets: ClientMarkets[];
    clientReference: string;
    contractsManagedBy: string;
    isDailyAccount: boolean;
  };
}

export interface MultiAccess {
  list: MultiAccessList[];
  canCreateClientAccount?: boolean;
  canCreateKamAccount?: boolean;
  maximumKamAccounts?: number;
  message?: string;
}
