export interface MarketList {
  country: string;
  energy: string;
  contracts: number;
  enabled: boolean;
  marketTrendsPartner: boolean;
  marketTrendsCompany: boolean;
  marketTrendsUser: boolean;
  hasCompanyMarketTrend: boolean;
  periodStart: string;
  periodEnd: string;
}
