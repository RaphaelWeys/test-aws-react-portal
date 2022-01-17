import React, { FC } from 'react';
import styled, { ThemeContext } from 'styled-components';

import SelectLang from '../../components/SelectLang';
import { HeaderOne } from '../../style/utils';

interface Props {
  className?: string;
  showLogo?: boolean;
  title?: string;
}

const RectangleBox: FC<Props> = ({ className, children, showLogo = true, title }) => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <div className={className}>
      {showLogo && <SelectLang />}
      {showLogo && <img alt="logo" src={themeContext.logo.login} style={{ marginBottom: '2rem' }} />}
      {title && <HeaderOne>{title}</HeaderOne>}
      {children}
    </div>
  );
};

export default styled(RectangleBox)`
  width: 100%;
  padding: 3.12rem;
  background: #ffffff 0 0 no-repeat padding-box;
  box-shadow: 0 0 8px #0000001a;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > img {
    width: 14rem;
  }

  ${SelectLang} {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
`;
