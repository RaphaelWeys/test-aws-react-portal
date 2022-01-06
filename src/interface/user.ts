export interface UserInfo {
  role: string;
  supplierId: null | string;
  admin: boolean;
  demo: boolean;
  language: string;
  validated: boolean;
  _id: string;
  id: string;
  username: string;
  firstName: string;
  tenant: string;
  lastName: string;
  isMultiAccess: boolean;
  company: string;
  companyField: string;
  createdDate: string;
  mailValidationToken: string;
  notificationPreference?: {
    sms: boolean;
    email: boolean;
  };
  __v: number;
  appPreferences: {
    portal: {
      processing: {
        agreeTermsConditions: boolean;
        agreePrivacyPolicy: boolean;
        personalDataProcessing: boolean;
      };
    };
  };
  multiaccess: { conditionsAcceptedByClient: boolean };
  resetPasswordExpires: string;
  resetPasswordToken: string;
  token: string;
}

export interface UserInfoError {
  message: string;
}

export interface UserInfoLight {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  company: string;
  id: string;
}
