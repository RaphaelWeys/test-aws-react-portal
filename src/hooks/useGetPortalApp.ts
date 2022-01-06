import { useTenant } from '../context/TenantContext';

const useGetPortalApp = () => {
  const { env } = useTenant();
  const isDevelopment = env.NODE_ENV === 'development';
  const isTest = env.NODE_ENV === 'test';

  return isDevelopment || isTest ? 'http://localhost:3000' : `${window.location.protocol}//${window.location.host}`;
};

export default useGetPortalApp;
