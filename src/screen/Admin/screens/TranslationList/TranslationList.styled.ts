import { Input } from 'antd';
import styled from 'styled-components';

export const ChoiceFilter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  & > * {
    margin-right: 16px;
  }
`;

export const InputStyled = styled(Input)`
  width: 80%;
  margin-top: 8px;
`;
