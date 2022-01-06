import { useTenant } from '../context/TenantContext';
import { useUserInfo } from '../context/UserInfoContext';

const useContactUs = () => {
  const { userInfo } = useUserInfo();
  const { env } = useTenant();

  switch (userInfo.language) {
    case 'en':
      return env.REACT_APP_CONTACT_US_EN;
    case 'it':
      return env.REACT_APP_CONTACT_US_IT;
    case 'fr':
      return env.REACT_APP_CONTACT_US_FR;
    case 'es':
      return env.REACT_APP_CONTACT_US_ES;
    case 'nl':
      return env.REACT_APP_CONTACT_US_NL;
    default:
      throw new Error('This language is not supported');
  }
};

export default useContactUs;
