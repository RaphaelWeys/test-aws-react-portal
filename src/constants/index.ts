import i18next from 'i18next';

// eslint-disable-next-line
export const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const MANAGED_BY = {
  CLIENT: 'client',
  KAM: 'kam',
};
// eslint-disable-next-line
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};‘:“\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};‘'":“\\|,.<>\/?èéêëēėęÿûüùúūîïíīįìôöòóœøōõoàáâäæãåāßśšłžźżçćčñń]{6,}$/;

export const getValidationCheck = () => ({
  validate: (value: string) => {
    if (!value.match(regexPassword)) {
      return i18next.t('global-password-check');
    }
    if (value.length > 16) {
      return i18next.t('global-password-check-max');
    }
    return undefined;
  },
});
