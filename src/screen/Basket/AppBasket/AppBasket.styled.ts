import styled, { css } from 'styled-components';

export const Logo = styled.img`
  width: 66px;
  margin-bottom: 20px;
`;

export const CancelIcon = styled.div`
  ${({ theme: { colors } }) => css`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    color: ${colors.baseColor};
  `}
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 2.8rem;
  text-align: center;
`;

export const WrapperSteps = styled.div`
  position: relative;
  display: flex;
  width: 305px;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

export const Step = styled.div<{ isActive: boolean }>`
  position: relative;
  color: #a6adb4;

  ${({ isActive }) => css`
    ::before {
      content: '';
      position: absolute;
      height: 15px;
      width: 15px;
      background-color: ${isActive ? '#a6adb4' : '#ECF0F4'};
      border-radius: 30px;
      transform: translateX(-50%);
      left: 50%;
      top: -20px;
      transition: 0.2s ease-in-out;
    }
  `}
`;

export const Line = styled.div`
  position: absolute;
  left: 14px;
  top: -14px;
  right: 14px;
  border: 1px solid #a6adb4;
`;

export const ContactUs = styled.div`
  ${({ theme: { colors } }) => css`
    margin-top: 22px;
    text-align: center;

    > :nth-child(2) {
      color: ${colors.baseColor};
      display: inline-block;
    }
  `}
`;
