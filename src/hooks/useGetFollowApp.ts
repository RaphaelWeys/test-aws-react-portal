import { useTenant } from '../context/TenantContext';

const useGetFollowApp = () => {
  const { env } = useTenant();
  const isDevelopment = env.NODE_ENV === 'development';
  const isTest = env.NODE_ENV === 'test';

  return isDevelopment || isTest ? 'http://localhost:3001' : env.REACT_APP_FOLLOW_APP;
};

export default useGetFollowApp;
