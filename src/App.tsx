import { createStore, StateMachineProvider } from 'little-state-machine';
import React, { FC, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import Analytics from 'react-router-ga';

// import { ReactQueryDevtools } from 'react-query/devtoolse';
import { ApiProvider } from './context/ApiContext';
import { LocalProvider } from './context/LocalContext';
import { TenantProvider } from './context/TenantContext';
import { UserInfoProvider } from './context/UserInfoContext';
import Routes from './router';
import history from './router/history';
import basketState from './StoreForm/basketState';
import createUserState from './StoreForm/createUserState';
import multiAccessClientState from './StoreForm/multiAccessClientState';
import GlobalStyle from './style/globalStyle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AnalyticsProvider: FC = ({ children }) => {
  if (process.env.REACT_APP_ANALYTIC_ID && process.env.NODE === 'production')
    return <Analytics id={process.env.REACT_APP_ANALYTIC_ID}>{children}</Analytics>;
  return <>{children}</>;
};

createStore({
  createUserForm: createUserState,
  basket: basketState,
  multiAccessClient: multiAccessClientState,
});

window.onunload = () => {
  // Clear all form when refreshing the page
  sessionStorage.clear();

  // Clear item in localStorage when redirect back to YOP or Tender
  localStorage.removeItem('callback');
};

const App: FC = () => (
  <Router history={history}>
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <UserInfoProvider>
          <ApiProvider>
            <GlobalStyle />

            <Suspense fallback=" ">
              {/* <ReactQueryDevtools /> */}

              <StateMachineProvider>
                <AnalyticsProvider>
                  <LocalProvider>
                    <Routes />
                  </LocalProvider>
                </AnalyticsProvider>
              </StateMachineProvider>
            </Suspense>
          </ApiProvider>
        </UserInfoProvider>
      </TenantProvider>
    </QueryClientProvider>
  </Router>
);

export default App;
