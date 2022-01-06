import { LocalType } from '../context/LocalContext';

export const LANGUAGE_CONFIG: LocalType[] = ['en', 'it', 'fr', 'es', 'nl'];
export const AdminLanguageItems = [
  { label: 'English', value: 'en', key: '0' },
  { label: 'Italian', value: 'it', key: '1' },
  { label: 'French', value: 'fr', key: '2' },
  { label: 'Spain', value: 'es', key: '3' },
  { label: 'Netherlands', value: 'nl', key: '4' },
];

export const COUNTRY_CONFIG = {
  countries: ['IT'],
};

export const SIGNATURE_DOC_SUPPLIER_STATUS = {
  NO_DOCUMENT: 'no-document', // No document provided
  WAITING_FOR_SIGNATURE: 'waiting-signature', // Documents provides, waiting for signature
  SIGNED: 'signed', // Documents are signed
  ABORTED_BY_DOC_SUPPLIER: 'aborted-by-supplier', // Process aborted by doc supplier (yem supplier)
  ABORTED_BY_DOC_SIGNER: 'aborted-by-signer', // Process aborted by doc signer (yem client)
};

export const SIGNATURE_DOC_SIGNER_STATUS = {
  NO_OFFER: 'no-offer', // No offer submited by doc supplier
  NO_PROCEDURE: 'no-procedure', // No sign procedure defined
  PROCEDURE_STARTED: 'procedure-started', // A procedure is started
  PROCEDURE_SIGNED: 'procedure-signed', // Procedure finished, documents signed
  ABORTED_BY_SUPPLIER: 'proc-aborted-supplier', // Procedure aborted by doc supplier (yem supplier)
  ABORTED_BY_SIGNER: 'proc-aborted-signer', // Procedure aborted by doc signer (yem client)
};

export const SIGNATURE_MEMBER_STATUS = {
  MEMBER_WAIT: 'member-wait', // Not yet invited to sign
  MEMBER_INVITED: 'member-invited', // Invited to sign
  MEMBER_SIGNED: 'member-signed', // Has signed
  MEMBER_REFUSED: 'member-refused', // Refused the documents
};
