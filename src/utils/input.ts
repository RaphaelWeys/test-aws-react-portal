import i18n from 'i18next';
import { FieldError, Message } from 'react-hook-form';

export const getErrorMessage = (error: FieldError, type?: string): Message => {
  if (typeof error.message === 'string' && error.message.length > 0) return i18n.t(error.message);
  if (error.type === 'required') return i18n.t(`global-field-${type}-required`);
  if (error.type === 'pattern') return i18n.t(`global-field-${type}-pattern`);

  return 'Error field';
};
