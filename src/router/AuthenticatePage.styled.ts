import styled, { css } from 'styled-components';

export const WrapperScroll = styled.div`
  ${({ theme: { breakpoints } }) => css`
    top: 60px;
    overflow: auto;
    position: relative;
    height: calc(100% - 60px);

    @media (min-width: ${breakpoints.sm}) {
      top: 75px;
      height: calc(100% - 75px);
    }
    @media (min-width: ${breakpoints.lg}) {
      top: 80px;
      height: calc(100% - 80px);
    }
  `}
`;

export const WrapperNotAuthenticate = styled.div`
  padding: 40px 0;
  display: flex;
  min-height: 100%;
  align-items: center;
`;
