import styled, { css } from 'styled-components';
import { Input } from 'antd';
import { FieldError } from 'react-hook-form';

import InvisibleButton from '../../../../components/InvisibleButton';

export const InputStyled = styled(Input)<{ error?: FieldError }>`
  ${({ error }) => css`
    width: 100%;
    margin-top: 8px;
    ${error && 'border: 1px solid #ff0000'};
  `}
`;

export const WrapperAction = styled.div`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: 18px;
  }
`;

export const SeeOrderLink = styled(InvisibleButton)`
  color: #2a94f1;
  text-decoration: underline;

  :hover {
    text-decoration: none;
  }
`;
