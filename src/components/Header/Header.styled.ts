import styled, { css } from 'styled-components';

export const LeftSide = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  img {
    height: 100%;
  }
`;

export const RightSide = styled.div<{ isDesktop?: boolean; show?: boolean }>`
  ${({ isDesktop, show, theme: { breakpoints } }) => {
    const mobileView = css`
      position: absolute;
      background: white;
      box-shadow: -4px 2px 3px 0 rgba(0, 0, 0, 0.04);
      padding: 0 2rem;
      width: 250px;
      right: ${show ? '0' : '-250px'};
      transition: all 0.5s ease-in-out;
      justify-content: flex-start;
      flex-direction: column;

      top: 60px;
      height: calc(100vh - 60px);

      @media (min-width: ${breakpoints.sm}) {
        top: 75px;
        height: calc(100vh - 75px);
      }
    `;

    return css`
      display: flex;
      color: #727577;

      ${!isDesktop && mobileView};
    `;
  }}
`;

export const BurgerMenu = styled.div`
  ${({ theme: { colors } }) => css`
    color: ${colors.headerIcon};
    font-size: 1.5rem;
  `}
`;

export const WrapperEnterprise = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export const Title = styled.div`
  > :first-child {
    font-family: 'Fira Sans', sans-serif;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  > :nth-child(2) {
    margin-bottom: 18px;
    font-size: 17px;
  }
`;

export const Content = styled.div`
  ${({ theme: { colors } }) => css`
    margin-top: 25px;

    & > * {
      color: ${colors.baseColor};
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 14px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  `}
`;

export const AccountLang = styled.div<{ isDesktop: boolean }>`
  ${({ isDesktop }) => css`
    display: flex;
    flex-direction: ${isDesktop ? 'row' : 'row-reverse'};
    align-self: flex-end;
  `}
`;
