import { useTenant } from '../context/TenantContext';

const useGetTenderApp = () => {
  const { env } = useTenant();
  const isDevelopment = env.NODE_ENV === 'development';
  const isTest = env.NODE_ENV === 'test';

  return isDevelopment || isTest ? 'http://localhost:3002' : env.REACT_APP_TENDER_APP;
};

export default useGetTenderApp;
