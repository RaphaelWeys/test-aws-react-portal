export interface FormRegisterStep1 {
  company: string;
  companyField: string;
  affiliation?: string;
}

export interface FormRegisterStep2 {
  firstName: string;
  lastName: string;
  username: string;
}

export type FormRegisterStep3 = {
  password: string;
  confirmPassword: string;
  preferences: {
    personalDataProcessing: boolean;
    agreeTermsConditions: boolean;
    agreePrivacyPolicy: boolean;
  };
};

export type FormRegister = FormRegisterStep1 & FormRegisterStep2 & FormRegisterStep3;

export interface PropsRegisterForm {
  className?: string;
}
