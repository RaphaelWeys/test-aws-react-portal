import { SIGNATURE_DOC_SUPPLIER_STATUS, SIGNATURE_MEMBER_STATUS } from '../config/app-config';

// ///////////////////////////////////////////////////////////////////////////////////////
// Supplier

export interface DocSupplierDocuments {
  originalname: string;
  mimetype: string;
  filename: string;
  size: number;
}

export interface CurrentVersion {
  docSupplierDocuments: DocSupplierDocuments[];
  docSupplierMessage: string;
  docSupplierStatus: keyof typeof SIGNATURE_DOC_SUPPLIER_STATUS;
  documentsDepositDate?: string;
  statusUpdateDate?: string;
}

export interface DocumentSignerContact {
  firstName: string;
  lastName: string;
  company: string;
  mail: string;
  phone: string;
}

export interface DocSupplierDocumentsArchived {
  originalname: string;
  mimetype: string;
  filename: string;
  size: number;
}

export interface ArchivedVersions {
  docSupplierDocuments: DocSupplierDocumentsArchived[];
  docSupplierMessage: string;
  docSupplierStatus: string;
  validators: [];
  signers: [];
  documentsDepositDate: string;
  statusUpdateDate: string;
  abortReason: string;
}

export interface SignaturePackSupplier {
  id: string;
  name: string;
  documentId: string;
  documentReference: string;
  documentSignerId: string;
  documentSignerContact: DocumentSignerContact;
  currentVersion: CurrentVersion;
  archivedVersions: ArchivedVersions[];
}

// ///////////////////////////////////////////////////////////////////////////////////////
// Client

export interface Validators {
  date: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: keyof typeof SIGNATURE_MEMBER_STATUS;
}

export interface Signers {
  date: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: keyof typeof SIGNATURE_MEMBER_STATUS;
}

export interface CurrentVersionClient {
  docSupplierDocuments: DocSupplierDocumentsArchived[];
  docSupplierMessage: string;
  docSupplierStatus: string;
  docSignerStatus: string;
  yousignInfo: { files: []; members: [] };
  validators: Validators[];
  signers: Signers[];
  documentsDepositDate: string;
  statusUpdateDate: string;
  abortReason: string;
}

export interface DocSupplierDocumentsClient {
  uid: string;
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  percent: number;
  originFileObj: { uid: string };
  status: string;
  response: {
    originalname: string;
    mimetype: string;
    filename: string;
    size: number;
  };
}

export interface ArchivedVersionsClient {
  docSupplierDocuments: DocSupplierDocumentsClient[];
  docSupplierMessage: string;
  docSupplierStatus: string;
  docSignerStatus: string;
  yousignInfo: { files: []; members: [] };
  validators: [];
  signers: [];
  documentsDepositDate: string;
  statusUpdateDate: string;
  abortReason: string;
}

export interface SignaturePackClient {
  id: string;
  name: string;
  documentId: string;
  documentName: string;
  documentReference: string;
  documentSignerId: string;
  documentSupplierName: string;
  documentSupplierContact: DocumentSignerContact;
  currentVersion: CurrentVersionClient;
  archivedVersions: ArchivedVersionsClient[];
}
