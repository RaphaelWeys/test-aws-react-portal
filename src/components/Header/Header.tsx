import { MenuOutlined } from '@material-ui/icons';
import { Popover, Space } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled, { css, ThemeContext } from 'styled-components';

import { useTenant } from '../../context/TenantContext';
import { useUserInfo } from '../../context/UserInfoContext';
import useClickAway from '../../hooks/useClickAway';
import useDesktop from '../../hooks/useDesktop';
import useGetFollowApp from '../../hooks/useGetFollowApp';
import { Navigation } from '../../navigation';
import { isClient, isKam, isManager, isMultiAccess } from '../../utils/behavior';
import AccountIcon from '../icons/AccountIcon';
import InvisibleButton from '../InvisibleButton';
import Modal from '../Modal';
import SafeHTMLTranslate from '../SafeHTMLTranslate';
import SelectLang from '../SelectLang';
import { AccountLang, BurgerMenu, Content, LeftSide, RightSide, Title, WrapperEnterprise } from './Header.styled';

interface Props {
  className?: string;
}

const Header: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const { env } = useTenant();
  const isDesktop = useDesktop();
  const themeContext = React.useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    content: '',
  });
  const followAppUrl = useGetFollowApp();
  const history = useHistory();
  const location = useLocation();
  const { userInfo } = useUserInfo();
  const slideNavRef = useRef<HTMLDivElement | null>(null);
  const [showSidebar, setShowSidebar] = useClickAway(slideNavRef);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    setShowSidebar(false);
    setShowPopover(false);
  }, [isDesktop, location.pathname, setShowSidebar, setShowPopover]);

  const handleRedirect = useCallback(
    (path) => {
      if (env.REACT_APP_REDIRECT_YOP_ON_LOGIN) {
        window.location.assign(followAppUrl);
      } else {
        history.push(path);
        setShowPopover(false);
        setShowSidebar(false);
      }
    },
    [env.REACT_APP_REDIRECT_YOP_ON_LOGIN, followAppUrl, history, setShowSidebar],
  );

  const handleOpenModal = useCallback(
    (modalNumber: number): void => {
      if (modalNumber === 0) {
        setModalInfo({
          title: userInfo.isMultiAccess ? t('modal-term-and-condition-title') : t('header-modal-general-title'),
          content: userInfo.isMultiAccess
            ? 'modal-term-and-condition-description-info'
            : 'header-modal-general-content-info',
        });
      }
      if (modalNumber === 1) {
        setModalInfo({
          title: t('header-modal-privacy-title'),
          content: 'header-modal-privacy-content-info',
        });
      }
      setShowPopover(false);
      setShowModal(true);
    },
    [t, userInfo.isMultiAccess],
  );

  const title = useMemo(
    () => (
      <Title>
        <div>{t('header-company-title')}</div>
        <div>
          {userInfo.firstName} {userInfo.lastName}
        </div>
      </Title>
    ),
    [userInfo.lastName, userInfo.firstName, t],
  );

  const getTermAndCondition = React.useCallback(() => {
    if (isMultiAccess(userInfo) && isClient(userInfo)) {
      return (
        <>
          <InvisibleButton onClick={() => history.push(Navigation.TERM_CGU)}>
            {t('header-term-and-condition-cgu')}
          </InvisibleButton>
          <InvisibleButton onClick={() => history.push(Navigation.TERM_RGPD)}>
            {t('header-term-and-condition-rgpd')}
          </InvisibleButton>
        </>
      );
    } if (!isMultiAccess(userInfo) && isClient(userInfo)) {
      return (
        <>
          <InvisibleButton onClick={() => handleOpenModal(0)}>{t('header-general-condition')}</InvisibleButton>
          <InvisibleButton onClick={() => handleOpenModal(1)}>{t('header-privacy-disclaimer')}</InvisibleButton>
        </>
      );
    }

    return null;
  }, [handleOpenModal, history, t, userInfo]);

  const content = useMemo(() => {
    const termAndCondition = getTermAndCondition();

    return (
      <Content data-testid="popover-testid">
        {userInfo.validated && (
          <>
            {isClient(userInfo) && (
              <InvisibleButton onClick={() => history.push('/payment-history')}>
                {t('header-invoice-payment')}
              </InvisibleButton>
            )}
            <InvisibleButton onClick={() => history.push('/update-password')}>
              {t('header-change-password')}
            </InvisibleButton>
            {termAndCondition}
            {(isKam(userInfo) || isManager(userInfo)) && (
              <InvisibleButton onClick={() => history.push(Navigation.MULTI_ACCESS)}>
                {isKam(userInfo) ? t('header-multi-access-kam') : t('header-multi-access-manager')}
              </InvisibleButton>
            )}
            {userInfo.admin && (
              <InvisibleButton onClick={() => history.push(Navigation.ADMIN_TRANSLATION)}>
                {t('header-admin')}
              </InvisibleButton>
            )}
          </>
        )}
        <InvisibleButton onClick={() => history.push(Navigation.LOGOUT)}>{t('header-log-out')}</InvisibleButton>
      </Content>
    );
  }, [getTermAndCondition, userInfo, t, history]);

  return (
    <header className={className} ref={slideNavRef}>
      <LeftSide data-testid="logo-test" onClick={() => handleRedirect(Navigation.DASHBOARD)}>
        <img alt="logo" src={themeContext.logo.dashboard} />
      </LeftSide>
      {!isDesktop && (
        <BurgerMenu>
          <MenuOutlined onClick={() => setShowSidebar(!showSidebar)} />
        </BurgerMenu>
      )}
      <RightSide isDesktop={isDesktop} show={showSidebar}>
        {!isDesktop && content}

        <AccountLang isDesktop={isDesktop}>
          <Space>
            {isDesktop && (
              <Popover
                content={content}
                placement="bottomRight"
                title={title}
                trigger="click"
                visible={showPopover}
                onVisibleChange={setShowPopover}
              >
                <WrapperEnterprise data-testid="enterprise-testid">
                  <AccountIcon color={themeContext.colors.headerButton} />
                </WrapperEnterprise>
              </Popover>
            )}

            <SelectLang isDesktop={isDesktop} />
          </Space>
        </AccountLang>
      </RightSide>

      <Modal
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        okText={t('global-close')}
        size="large"
        title={modalInfo.title}
        visible={showModal}
        onCancel={(): void => setShowModal(false)}
        onOk={(): void => setShowModal(false)}
      >
        <SafeHTMLTranslate template={modalInfo.content} Type="p" />
      </Modal>
    </header>
  );
};

export default styled(React.memo(Header))`
  ${({ theme: { breakpoints, colors } }) => css`
    height: 60px;
    width: 100%;
    padding: 0 20px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${colors.header};
    z-index: 100;
    box-shadow: 0 0 8px #00000026;

    ${InvisibleButton} {
      text-align: left;
      font-weight: bold;
    }
    @media (min-width: ${breakpoints.sm}) {
      height: 75px;
    }
    @media (min-width: ${breakpoints.lg}) {
      height: 80px;
    }
  `}
`;
