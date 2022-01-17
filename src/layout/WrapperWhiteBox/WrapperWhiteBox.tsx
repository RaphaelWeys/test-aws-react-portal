import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled, { css, ThemeContext } from 'styled-components';

import ButtonLink from '../../components/ButtonLink';
import CloseIcon from '../../components/icons/CloseIcon';
import { HeaderOne, MainLinkStyle, TextSmall } from '../../style/utils';
import { ButtonClose, NavigationIcon } from './WrapperWhiteBox.styled';

interface Props {
  className?: string;
  backButtonText?: string;
  to?: string;
  hasCloseIcon?: boolean;
  onCancel?: () => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  preTitle?: string;
  extra?: React.ReactNode;
}

const WrapperWhiteBox: FC<Props> = ({
  className,
  children,
  backButtonText,
  to,
  hasCloseIcon,
  onCancel,
  icon,
  title,
  extra,
  preTitle,
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const themeContext = React.useContext(ThemeContext);

  const isDifferentDomain = React.useMemo(() => to?.startsWith('https://') || to?.startsWith('http://'), [to]);

  const handleClickBackButton = React.useCallback(() => {
    if (isDifferentDomain) {
      window.location.assign(to);
    } else {
      history.push(to);
    }
  }, [history, isDifferentDomain, to]);

  return (
    <>
      {backButtonText && to && (
        <NavigationIcon align="left">
          <ButtonLink iconPosition="left" onClick={handleClickBackButton}>
            {isDifferentDomain ? t('global-back') : t(backButtonText)}
          </ButtonLink>
        </NavigationIcon>
      )}
      <>
        {hasCloseIcon && (
          <NavigationIcon align="right">
            <MainLinkStyle>
              <ButtonClose onClick={() => onCancel()}>
                <Space align="center">
                  {t('global-cancel')}
                  <CloseIcon color={themeContext.colors.baseColor} />
                </Space>
              </ButtonClose>
            </MainLinkStyle>
          </NavigationIcon>
        )}
        <Space className={className} direction="vertical" size="large">
          {(preTitle || icon || title) && (
            <Space direction="vertical">
              {preTitle && <TextSmall>{preTitle.toUpperCase()}</TextSmall>}

              {(icon || title) && (
                <Row align="middle" gutter={[0, 12]} justify="space-between" style={{ width: '100%' }}>
                  <Col>
                    <Space size="middle">
                      {icon && icon}
                      {title && <HeaderOne>{title}</HeaderOne>}
                    </Space>
                  </Col>
                  <Col>{extra}</Col>
                </Row>
              )}
            </Space>
          )}
          {children}
        </Space>
      </>
    </>
  );
};

export default styled(WrapperWhiteBox)`
  ${({ theme: { colors } }) => css`
    background-color: ${colors.white};
    padding: 1.8rem 2.18rem 2.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    width: 100%;
    position: relative;
  `}
`;
