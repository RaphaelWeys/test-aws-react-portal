import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import appMarketplace from '../../assets/app-marketplace.svg';
import appOptimization from '../../assets/app-optimization.svg';
import CustomLink from '../../components/CustomLink';
import GradientButton from '../../components/GradientButton';
import InvisibleButton from '../../components/InvisibleButton';
import TitlePage from '../../components/TitlePage';
import useGetFollowApp from '../../hooks/useGetFollowApp';
import useGetTenderApp from '../../hooks/useGetTenderApp';
import MainLayout from '../../layout/MainLayout';
import { App, WrapperApps } from './Dashboard.styled';

interface Props {
  className?: string;
}

const Dashboard: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const followAppUrl = useGetFollowApp();
  const tenderAppUrl = useGetTenderApp();

  const redirectApp = (nb: number) =>
    nb === 0 ? window.location.assign(tenderAppUrl) : window.location.assign(followAppUrl);

  const apps = React.useMemo(
    () => [
      { key: 0, title: t('home-app-marketplace'), logo: appMarketplace },
      { key: 1, title: t('home-app-optimization'), logo: appOptimization },
    ],
    [t],
  );

  return (
    <MainLayout hasBg={false}>
      <div className={className}>
        <TitlePage>{t('home-title')}</TitlePage>

        <WrapperApps>
          {apps.map((app) => (
            <InvisibleButton key={app.key} onClick={() => redirectApp(app.key)}>
              <App>
                <div>{app.title}</div>
                <img alt="logo" src={app.logo} />
              </App>
            </InvisibleButton>
          ))}
        </WrapperApps>
      </div>
    </MainLayout>
  );
};

export default styled(Dashboard)`
  width: 100%;
  margin: 0 auto;

  ${CustomLink} {
    font-size: 13px;
    align-self: flex-start;
  }

  ${GradientButton} {
    margin: 30px auto 50px;
  }
`;
