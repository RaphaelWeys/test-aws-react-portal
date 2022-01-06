interface RfoCompanies {
  _id: string;
  name: string;
  field: string;
  vat: string;
  fiscalId: string;
  country: string;
  createdDate: string;
  modifiedDate: string;
  userId: string;
  __v: 0;
  id: string;
  cervedScore?: {
    score: number;
    fake: boolean;
  };
}

interface RfoSites {
  _id: string;
  company: {
    _id: string;
    name: string;
    field: string;
    vat: string;
    fiscalId: string;
    country: string;
    createdDate: string;
    modifiedDate: string;
    userId: string;
    __v: 0;
    id: string;
  };
  energy: string;
  name: string;
  address: string;
  city: string;
  zipcode: string;
  province: string;
  distributor: string;
  pod: string;
  activity: string;
  remi: string;
  pdr: string;
  cogenerator: string;
  hasDistributor: string;
  daysperweek: string;
  createdDate: string;
  modifiedDate: string;
  userId: string;
  __v: number;
  id: string;
  showDetails: boolean;
  annualConsumption: string;
  dailyVolume: string;
  volumesCompleted: true;
}

export interface RfoDetailFiles {
  complete: boolean;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  filename: string;
}

interface PdfUserFilesItem {
  name: string;
  filename: string;
  created: number;
  blurred: boolean;
}

interface RfoContact {
  firstName: string;
  lastName: string;
  mail: string;
  confirmmail: string;
  mobile: string;
}

interface RfoPdfUserFiles {
  'rfo-gas-EN': PdfUserFilesItem;
  'rfo-gas-EN-preview': PdfUserFilesItem;
  'rfo-gas-IT': PdfUserFilesItem;
  'rfo-gas-IT-preview': PdfUserFilesItem;
}

interface RfoPdfSupplierFiles {
  'rfo-gas-EN': PdfUserFilesItem;
  'rfo-gas-IT': PdfUserFilesItem;
}

interface RfoDelivery {
  currentContactEndDate: string;
  months: number;
  start: string;
}

interface RfoPrice {
  priceIndexation: string;
  gasMarketplace: string;
  gasIndex: string;
  powerMarketplace: string;
  minimumFixingSlice: string;
}

interface RfoPrice {
  offerDuration: number;
  offerProcessing: string;
  offerResponseDate: string;
  offerResponseTime: string;
}

interface RfoBilling {
  financialGuarantee: string;
  invoiceMode: string;
  invoicePeriod: string;
  paymentTerms: string;
}

interface RfoOffer {
  offerDuration: number;
  offerProcessing: string;
  offerResponseDate: string;
  offerResponseTime: string;
}

interface RfoCustomerCriterions {
  label: string;
  value: string;
}

interface RfoPreference {
  customerCriterions: RfoCustomerCriterions[];
}

export interface RfoDetailMultisite {
  isMultisite: boolean;
  excelFile?: RfoDetailFiles;
  annualConsumption?: number;
}

export interface Rfo {
  __v: number;
  _id: string;
  billing: RfoBilling;
  companies: RfoCompanies[];
  contact: RfoContact;
  country: string;
  createdDate: string;
  delivery: RfoDelivery;
  energy: string;
  groupName: string;
  id: string;
  modifiedDate: string;
  multisite: RfoDetailMultisite;
  name: string;
  offer: RfoOffer;
  offerResponseDate: string;
  offerType: string;
  pdfSupplierFiles: RfoPdfSupplierFiles;
  pdfUserFiles: RfoPdfUserFiles;
  preferences: RfoPreference;
  price: RfoPrice;
  reference: string;
  reminderH24Sent: boolean;
  sentToSuppliers: boolean;
  sites: RfoSites[];
  state: string;
  suppliers: [];
  userId: string;
  version: number;
  volumeCheckedFiles: RfoDetailFiles[];
  volumeUserFiles: RfoDetailFiles[];
}
