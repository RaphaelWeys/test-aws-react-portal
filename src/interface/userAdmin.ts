export interface IUserAdmin {
  username: string;
  firstName: string;
  lastName: string;
  company?: string;
  companyField?: string;
  role: string;
  supplierId: string | null;
  createdDate: Date;
  _id: string;
  id: string;

  // Modes specifics
  admin: boolean;
  demo: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  appPreferences: Record<string, unknown>;
  language: string;

  // Email validation
  validated: boolean;
  mailValidationToken?: string;
  mailValidationExpires: Date;
  affiliation?: string;
  products: {
    portal: any;
    follow: {
      orderId: string;
      product: string;
      subscriptionEnd: string;
      subscriptionStart: string;
      contracts: number;
    };
  };
}
